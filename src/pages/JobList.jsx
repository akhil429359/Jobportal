// src/pages/JobList.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import debounce from "lodash.debounce";

const JobList = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [showMyJobs, setShowMyJobs] = useState(false);

  // Fetch profile and applications once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("user-profiles/");
        if (profileRes.data.length > 0) setProfile(profileRes.data[0]);

        const appRes = await api.get("applications/");
        setApplications(appRes.data.map((app) => app.job_id));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch jobs
  const fetchJobs = async () => {
    if (!profile) return;
    try {
      const res = await api.get("job-posts/", {
        params: {
          search: search || undefined,
          location: location || undefined,
          status: status || undefined,
          my_jobs:
            profile.role === "employer" && showMyJobs ? "true" : undefined,
        },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // Debounced fetch for search/location
  const debouncedFetchJobs = useCallback(debounce(fetchJobs, 300), [
    search,
    location,
    status,
    showMyJobs,
    profile,
  ]);

  // Fetch jobs whenever filters or showMyJobs changes
  useEffect(() => {
    debouncedFetchJobs();
  }, [search, location, status, showMyJobs, profile, debouncedFetchJobs]);

  // Job seeker applies to job
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

  return (
    <div style={styles.container}>
      <h2>Job Listings</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>

        {profile.role === "employer" && (
          <button
            onClick={() => setShowMyJobs(!showMyJobs)}
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
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job.id} style={styles.card}>
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary_range}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Requirements:</strong> {job.requirements}</p>

              {/* Job seeker apply button */}
              {profile.role === "jobseeker" &&
                (applications.includes(job.id) ? (
                  <button
                    style={{ ...styles.button, backgroundColor: "#6c757d" }} // grey
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  <button
                    style={{ ...styles.button, backgroundColor: "#007bff" }} // blue
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? "Applying..." : "Apply"}
                  </button>
                ))}
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
