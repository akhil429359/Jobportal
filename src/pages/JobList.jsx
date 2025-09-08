// src/pages/JobList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const JobList = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [showMyJobs, setShowMyJobs] = useState(false); // 👈 NEW

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await api.get("user-profiles/");
        if (profileRes.data.length > 0) setProfile(profileRes.data[0]);

        // Fetch applications
        const appRes = await api.get("applications/");
        setApplications(appRes.data.map((app) => app.job));

        // Fetch jobs initially
        fetchJobs();
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("job-posts/", {
        params: {
          search: search || undefined,
          location: location || undefined,
          status: status || undefined,
          my_jobs: profile?.role === "employer" && showMyJobs ? "true" : undefined,
        },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);
      await api.post("applications/", { job_id: jobId });
      alert("Application submitted!");
      setApplications([...applications, jobId]);
    } catch (err) {
      console.error("Error applying:", err);
      alert("Failed to apply.");
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Please complete your profile first.</p>;

  // Filtered jobs
  let filteredJobs = jobs;
  if (profile.role === "employer" && showMyJobs) {
    // show only jobs posted by logged-in employer
    filteredJobs = jobs.filter(
      (job) => job.user === profile.user.id || job.user?.id === profile.user.id
    );
  }

  return (
    <div style={styles.container}>
      <h2>Job Listings</h2>

      {/* Search + Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={fetchJobs}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyUp={fetchJobs}
          style={styles.input}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            fetchJobs();
          }}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>

        {/* 👇 Toggle my jobs only for employers */}
        {profile.role === "employer" && (
          <button
            onClick={() => {
              setShowMyJobs(!showMyJobs);
              fetchJobs(); // refetch after toggle
            }}
            style={{
              ...styles.button,
              backgroundColor: showMyJobs ? "#28a745" : "#007bff",
            }}
          >
            {showMyJobs ? "Show All Jobs" : "Show My Jobs"}
          </button>
        )}

      </div>

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredJobs.map((job) => (
            <div key={job.id} style={styles.card}>
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary_range}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Requirements:</strong> {job.requirements}</p>

              {profile.role === "jobseeker" && (
                applications.includes(job.id) ? (
                  <button
                    style={{ ...styles.button, backgroundColor: "#6c757d" }}
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  <button
                    style={styles.button}
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? "Applying..." : "Apply"}
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  select: {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default JobList;
