// src/pages/PostJob.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const JobPost = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    salary_range: "",
    requirements: "",
    status: "open",
    requirements: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("user-profiles/");
        if (response.data.length > 0) {
          setProfile(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("job-posts/", jobData);
      alert("Job posted successfully!");
      navigate("/user-home");
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err);
      alert(err.response?.data?.detail || "Failed to post job.");
    }
  };

  const switchToEmployer = async () => {
    try {
      const updated = { ...profile, role: "employer" };
      const response = await api.put(`user-profiles/${profile.id}/`, updated);
      setProfile(response.data);
      alert("Role switched to Employer! Now you can post jobs.");
    } catch (err) {
      console.error("Error switching role:", err.response?.data || err);
    }
  };

  if (loading) return <p>Loading...</p>;

  // No profile found
  if (!profile) {
    return (
      <div style={styles.container}>
        <h2>You need to complete your profile before posting a job.</h2>
        <button style={styles.button} onClick={() => navigate("/my-profile")}>
          Create Profile
        </button>
      </div>
    );
  }

  // User is jobseeker
  if (profile.role === "jobseeker") {
    return (
      <div style={styles.container}>
        <h2>Only Employers can post jobs.</h2>
        <button style={styles.button} onClick={switchToEmployer}>
          Switch to Employer
        </button>
      </div>
    );
  }

  // User is employer → show job form
  return (
    <div style={styles.container}>
      <h2>Post a Job</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="salary_range"
          placeholder="Salary Range"
          onChange={handleChange}
          required
        />
        <textarea
          name="requirements"
          placeholder="Job Requirements"
          onChange={handleChange}
          required
        />
        <select name="status" onChange={handleChange} value={jobData.status}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>
        <label>Requirements</label>
        <textarea name="requirements" onChange={handleChange} required />
        
        <button type="submit" style={styles.button}>
          Submit Job
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "400px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default JobPost;
