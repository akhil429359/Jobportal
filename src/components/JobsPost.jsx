import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const JobsPost = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState({ title: "", description: "", location: "", salary_range: "", requirements: "", status: "open", questions: [] });
  const [questionInput, setQuestionInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("user-profiles/");
        if (response.data.length > 0) setProfile(response.data[0]);
      } 
      catch (err) { console.error("Error fetching profile:", err); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => { setJobData({ ...jobData, [e.target.name]: e.target.value }); };
  const handleQuestionAdd = () => { if (questionInput.trim() !== "") { setJobData((prev) => ({ ...prev, questions: [...prev.questions, questionInput.trim()] })); setQuestionInput(""); } };
  const handleQuestionRemove = (index) => { setJobData((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...jobData, questions: jobData.questions || [] };
    try {
      await api.post("job-posts/", payload);
      alert("Job posted successfully!");
      navigate("/user-home");
    } 
    catch (err) {
      console.error("Error posting job:", err.response?.data || err);
      if (err.response?.data) {
        const messages = Object.entries(err.response.data).map(([field, msgs]) => Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${msgs}`).join("\n");
        alert(`Failed to post job:\n${messages}`);
      } 
      else { alert("Failed to post job. Please try again."); }
    }
  };

  const switchToEmployer = async () => {
    try { 
      const response = await api.patch(`user-profiles/${profile.id}/`, { role: "employer" }); 
      setProfile(response.data); 
      alert("Role switched to Employer!"); 
      navigate(0); 
    } 
    catch (err) { 
      console.error("Error switching role:", err.response?.data || err); 
      alert("Failed to switch role. Please try again."); 
    }
  };

  if (loading) 
    return <p>Loading...</p>;

  else if (!profile) 
    return <div style={styles.container}><h2>You need to complete your profile before posting a job.</h2><button style={styles.button} onClick={() => navigate("/my-profile")}>Create Profile</button></div>;

  else if (profile.role === "jobseeker") 
    return <div style={styles.container}><h2>Only Employers can post jobs.</h2><button style={styles.button} onClick={switchToEmployer}>Switch to Employer</button></div>;

  else 
    return (
      <div style={styles.container}>
        <h2>Post a Job</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Job Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Job Description" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input type="text" name="salary_range" placeholder="Salary Range" onChange={handleChange} required />
          <textarea name="requirements" placeholder="Job Requirements" onChange={handleChange} required />
          <select name="status" onChange={handleChange} value={jobData.status}><option value="open">Open</option></select>
          <div style={{ marginTop: "15px" }}>
            <h3>Questions for applicants</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input type="text" placeholder="Add a question" value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} style={styles.questionInput} />
              <button type="button" onClick={handleQuestionAdd} style={styles.addButton}>Add</button>
            </div>
            <div style={styles.questionsList}>
              {jobData.questions.map((q, index) => <div key={index} style={styles.questionCard}><span>{q}</span><button type="button" onClick={() => handleQuestionRemove(index)} style={styles.removeButton}>×</button></div>)}
            </div>
          </div>
          <button type="submit" style={styles.button}>Submit Job</button>
        </form>
      </div>
    );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px", width: "400px" },
  button: { padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  questionInput: { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  addButton: { padding: "8px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  questionsList: { display: "flex", flexDirection: "column", gap: "8px" },
  questionCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", borderRadius: "5px", backgroundColor: "#f1f1f1" },
  removeButton: { padding: "2px 6px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer" },
};

export default JobsPost;
