import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const EmployerJobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("job-posts/", { params: { my_jobs: true } });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load your job posts.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your job posts...</p>;
  if (error) return <p>{error}</p>;
  if (jobs.length === 0) return <p>You haven’t posted any jobs yet.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Job Posts</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginTop: 16 }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", background: "#f9f9f9", display: "flex", flexDirection: "column", gap: 8 }}>
            <h3 style={{ marginBottom: 8 }}>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Salary:</strong> {job.salary_range}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => navigate(`/employer-applications/${job.id}`)} style={{ padding: "8px 12px", background: "#673ab7", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>View Applicants</button>
              <button onClick={() => navigate(`/jobs-edit/${job.id}`)} style={{ padding: "8px 12px", background: "#009688", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerJobPosts;
