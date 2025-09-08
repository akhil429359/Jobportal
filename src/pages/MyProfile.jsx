// src/pages/MyProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    skills: "",
    education: "",
    experience: "",
    about_me: "",
    resume: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("user-profiles/"); // returns array
        if (response.data.length > 0) {
          setProfile(response.data[0]); // normal user has only 1 profile
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Secure resume download
  const viewResume = async () => {
    if (!profile?.resume) return;
    try {
      const response = await api.get(`user-profiles/${profile.id}/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", profile.resume.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading resume:", err);
    }
  };

  // Switch role between Jobseeker and Employer
  const handleSwitchRole = async () => {
    if (!profile) return;
    const newRole = profile.role.toLowerCase() === "jobseeker" ? "employer" : "jobseeker";
    try {
      const response = await api.patch(`user-profiles/${profile.id}/`, {
        role: newRole,
      });
      setProfile(response.data);
      alert(`Switched role to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}!`);
    } catch (err) {
      console.error("Error switching role:", err);
      alert("Failed to switch role.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Create new profile
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      if (formData[key]) form.append(key, formData[key]);
    }
    try {
      const response = await api.post("user-profiles/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(response.data);
      setShowForm(false);
    } catch (err) {
      console.error("Error creating profile:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Case 1: profile exists
  if (profile) {
    return (
      <div style={styles.container}>
        <h2>My Profile</h2>
        <div style={styles.card}>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>About Me:</strong> {profile.about_me}</p>
          {profile.resume ? (
            <button style={styles.button} onClick={viewResume}>View Resume</button>
          ) : (
            <p><strong>Resume:</strong> None</p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              style={styles.button}
              onClick={() => navigate(`/edit-profile/${profile.id}`)}
            >
              Edit Profile
            </button>

            <button
              style={{ ...styles.button, backgroundColor: "green" }}
              onClick={handleSwitchRole}
            >
              {profile.role.toLowerCase() === "jobseeker" ? "Switch to Employer" : "Switch to Jobseeker"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: no profile found
  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      {!showForm ? (
        <button style={styles.button} onClick={() => setShowForm(true)}>
          Create New Profile
        </button>
      ) : (
        <form onSubmit={handleCreateProfile} style={styles.card}>
          <label>Skills</label>
          <input type="text" name="skills" onChange={handleChange} required />

          <label>Education</label>
          <input type="text" name="education" onChange={handleChange} required />

          <label>Experience</label>
          <input type="text" name="experience" onChange={handleChange} required />

          <label>About Me</label>
          <textarea name="about_me" onChange={handleChange} required />

          <label>Resume (PDF)</label>
          <input type="file" name="resume" accept="application/pdf" onChange={handleChange} />

          <button type="submit" style={styles.button}>Save Profile</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    flexDirection: "column",
  },
  card: {
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MyProfile;
