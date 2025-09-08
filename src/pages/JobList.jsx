// src/JobList.jsx
import React, { useState, useEffect } from "react";
import api from "./api";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const { data } = await api.get("job-posts/");
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search and role
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? job.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Job Listings</h2>

      {/* Search bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "5px" }}
        />

        {/* Filter example */}
        
      </div>

      {/* Job list */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
