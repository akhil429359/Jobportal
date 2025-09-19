import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function JobApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`applications/${id}/`);
      setApplication(res.data);
    } catch (err) {
      setError("Failed to fetch application details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  if (loading) return <p style={styles.center}>Loading application...</p>;
  if (error) return <p style={styles.center}>{error}</p>;
  if (!application) return <p style={styles.center}>No application found.</p>;

  const { applicant_user: user = {}, applicant_profile: profile = {}, job_details: job = {}, answers = {} } = application;

  return (
    <div style={styles.container}>
      <h2>Application Details</h2>
      <div style={styles.card}>
        <Section title="Applicant Information">
          <Info label="Username" value={user.username} />
          <Info label="Email" value={user.email} />
          <Info label="Role" value={profile.role} />
          <Info label="Skills" value={profile.skills} />
          <Info label="Education" value={profile.education} />
          <Info label="Experience" value={profile.experience} />
          <Info label="About Me" value={profile.about_me} />
        </Section>

        <Section title="Job Information">
          <Info label="Title" value={job.title} />
          <Info label="Location" value={job.location} />
          <Info label="Salary Range" value={job.salary_range} />
          <Info label="Status" value={job.status} />
        </Section>

        <Section title="Applicant Answers">
          {Object.keys(answers).length > 0 ? (
            <ul style={{ paddingLeft: 20 }}>
              {Object.entries(answers).map(([q, a], idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>
                  <strong>{q}:</strong> {a || "Not answered"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No answers submitted.</p>
          )}
        </Section>

        <Section title="Application Status">
          <p>{application.status || "Pending"}</p>
          <p>
            <strong>Applied On:</strong> {new Date(application.applied_date).toLocaleString()}
          </p>
        </Section>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => <p><strong>{label}:</strong> {value || "N/A"}</p>;
const Section = ({ title, children }) => <div style={{ marginBottom: 16 }}><h3>{title}</h3>{children}</div>;

const styles = {
  container: { padding: 20 },
  card: { border: "1px solid #ddd", borderRadius: 8, padding: 20, maxWidth: 600, background: "#f9f9f9", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  center: { textAlign: "center", marginTop: 30 },
};

export default JobApplicationDetail;
