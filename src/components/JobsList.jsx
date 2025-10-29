import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import debounce from "lodash.debounce";

const JobsList = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [showMyJobs, setShowMyJobs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("user-profiles/"); if (profileRes.data.length > 0) setProfile(profileRes.data[0]);
        const appRes = await api.get("applications/"); setApplications(appRes.data.map((app) => app.job_id));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const fetchJobs = async () => {
    if (!profile) return;
    try {
      const res = await api.get("job-posts/", { params: { search: search || undefined, location: location || undefined, status: status || undefined, my_jobs: profile.role === "employer" && showMyJobs ? "true" : undefined } });
      let fetchedJobs = res.data;
      if (profile.role === "jobseeker") fetchedJobs = fetchedJobs.filter((job) => job.status === "open");
      setJobs(fetchedJobs);
    } catch (err) { console.error(err); }
  };

  const debouncedFetchJobs = useCallback(debounce(fetchJobs, 300), [search, location, status, showMyJobs, profile]);

  useEffect(() => { debouncedFetchJobs(); }, [search, location, status, showMyJobs, profile, debouncedFetchJobs]);

  const handleApply = (job) => { navigate(`/jobs/${job.id}/apply`); };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh", textAlign: "center", gap: 20 }}><p style={{ fontSize: 18, color: "#555" }}>Please complete your profile first.</p><button onClick={() => navigate("/my-profile")} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Complete Profile</button></div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Job Listings</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 5 }} />
        <input type="text" placeholder="Filter by location..." value={location} onChange={(e) => setLocation(e.target.value)} style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 5 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8, border: "1px solid #ddd", borderRadius: 5 }}>
          <option value="">All Status</option><option value="open">Open</option><option value="closed">Closed</option><option value="paused">Paused</option>
        </select>
        {profile.role === "employer" && <button onClick={() => setShowMyJobs(!showMyJobs)} style={{ padding: "8px 16px", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", backgroundColor: showMyJobs ? "#28a745" : "#007bff" }}>{showMyJobs ? "Show All Jobs" : "Show My Jobs"}</button>}
      </div>
      {jobs.length === 0 ? <p>No jobs found.</p> : <div style={{ display: "grid", gap: 20 }}>{jobs.map((job) => {
        const isEmployerOwnJob = profile.role === "employer" && ((job.user && job.user.id) || job.user) === profile.id;
        const isApplied = applications.includes(job.id);
        const CardContent = <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15 }}><h3>{job.title}</h3><p>Location: {job.location}</p><p>Salary: {job.salary_range}</p><p>Status: {job.status}</p><p>Description: {job.description}</p><p><strong>Requirements:</strong> {job.requirements}</p>{profile.role === "jobseeker" && <button onClick={() => handleApply(job)} disabled={isApplied || applying === job.id} style={{ backgroundColor: isApplied ? "#6c757d" : "#007bff", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 5, cursor: isApplied ? "not-allowed" : "pointer" }}>{isApplied ? "Already Applied" : applying === job.id ? "Applying..." : "Apply"}</button>}</div>;
        return isEmployerOwnJob ? <Link key={job.id} to={`/applied-users/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>{CardContent}</Link> : <div key={job.id}>{CardContent}</div>;
      })}</div>}
    </div>
  );
};

export default JobsList;
