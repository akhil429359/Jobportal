// src/pages/EditJobPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditJob = () => {
  const { id } = useParams(); // job id from URL
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form fields
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
      navigate("/jobs"); // back to jobs list
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Job</h2>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Salary Range"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <textarea
          placeholder="Requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          style={{ padding: "10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditJob;
