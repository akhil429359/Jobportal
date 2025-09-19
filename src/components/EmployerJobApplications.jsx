import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const statusOptions = ["Pending", "Shortlisted", "Rejected", "Hired"];

const EmployerJobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("applications/", { params: { job: jobId } });
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      await api.patch(`applications/${appId}/`, { status: newStatus });
      setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app)));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p style={styles.centerText}>Loading applicants...</p>;
  if (error) return <p style={styles.centerText}>{error}</p>;
  if (applications.length === 0) return <p style={styles.centerText}>No applicants have applied for this job yet.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Applicants</h2>
      <div style={styles.grid}>
        {applications.map((app) => {
          const user = app.applicant_user || {};
          const profile = app.applicant_profile || {};
          const answers = app.answers || {};
          return (
            <div key={app.id} style={styles.card}>
              <div style={styles.header}>
                <div style={styles.username}>{user.username || "Unknown User"}</div>
                <div style={styles.statusBadge}>{app.status || "Pending"}</div>
              </div>
              <div style={styles.info}><span style={styles.fieldName}>Email:</span> {user.email || "No Email"}</div>
              <div style={styles.info}><span style={styles.fieldName}>Role:</span> {profile.role || "N/A"}</div>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Profile Details</h3>
                <div><span style={styles.fieldName}>Skills:</span> {profile.skills || "Not provided"}</div>
                <div><span style={styles.fieldName}>Education:</span> {profile.education || "Not provided"}</div>
                <div><span style={styles.fieldName}>Experience:</span> {profile.experience || "Not provided"}</div>
                <div>
                  <span style={styles.fieldName}>Resume:</span> {profile.resume ? (
                    <a href={`http://localhost:8000${profile.resume}`} target="_blank" rel="noopener noreferrer" style={styles.resumeLink}>View Resume</a>
                  ) : " No resume uploaded"}
                </div>
              </div>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Answers</h3>
                {Object.keys(answers).length > 0 ? (
                  <ul style={styles.answerList}>
                    {Object.entries(answers).map(([question, answer], index) => (
                      <li key={index}><span style={styles.fieldName}>{question}:</span> {answer || "Not answered"}</li>
                    ))}
                  </ul>
                ) : <p>No answers submitted.</p>}
              </div>
              <div style={styles.section}>
                <label htmlFor={`status-${app.id}`} style={styles.fieldName}><b>Update Status:</b></label>
                <select id={`status-${app.id}`} value={app.status || "Pending"} onChange={(e) => handleStatusChange(app.id, e.target.value)} disabled={updatingId === app.id} style={styles.select}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" },
  heading: { textAlign: "center", marginBottom: "25px", fontSize: "2.2rem", fontWeight: "800" },
  grid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" },
  card: {
    width: "320px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "left",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  username: { fontWeight: "700", fontSize: "1.3rem" },
  statusBadge: {
    backgroundColor: "#09631fff",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.85rem",
  },
  info: { fontSize: "0.95rem" },
  section: { borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "10px" },
  sectionTitle: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" },
  fieldName: { fontWeight: "600", fontSize: "1rem" },
  answerList: { paddingLeft: "20px" },
  resumeLink: { color: "#007bff", textDecoration: "underline" },
  select: { marginTop: "5px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.95rem" },
  centerText: { textAlign: "center", marginTop: "30px", fontSize: "1rem" },
};

export default EmployerJobApplications;
