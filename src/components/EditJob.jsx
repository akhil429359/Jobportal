import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [status, setStatus] = useState("open");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`job-posts/${id}/`);
        setJob(res.data);
        setTitle(res.data.title);
        setLocation(res.data.location);
        setSalaryRange(res.data.salary_range);
        setStatus(res.data.status);
        setDescription(res.data.description);
        setRequirements(res.data.requirements);
      } catch (err) {
        console.error("Error fetching job:", err);
        alert("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`job-posts/${id}/`, {
        title,
        location,
        salary_range: salaryRange,
        status,
        description,
        requirements,
      });
      alert("Job updated successfully!");
      navigate("/my-jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading job details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Job</h2>
      <form onSubmit={handleSave} style={styles.form}>
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} required />
        <input type="text" placeholder="Salary Range" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} style={styles.input} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={styles.textarea} />
        <textarea placeholder="Requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} style={styles.textarea} />
        <button type="submit" style={styles.button} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "vertical",
    fontSize: "1rem",
  },
  button: {
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default EditJob;
