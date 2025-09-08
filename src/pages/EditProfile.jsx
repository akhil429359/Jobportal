// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditProfile = () => {
  const { id } = useParams(); // profile ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skills: "",
    education: "",
    experience: "",
    about_me: "",
    role: "jobseeker",
    resume: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data to prefill form
    const fetchProfile = async () => {
      try {
        const response = await api.get(`user-profiles/${id}/`);
        const profile = response.data;
        setFormData({
          skills: profile.skills,
          education: profile.education,
          experience: profile.experience,
          about_me: profile.about_me,
          role: profile.role,
          resume: null, // file input starts empty
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("skills", formData.skills);
    data.append("education", formData.education);
    data.append("experience", formData.experience);
    data.append("about_me", formData.about_me);
    data.append("role", formData.role);
    if (formData.resume) {
      data.append("resume", formData.resume);
    }

    try {
      await api.patch(`user-profiles/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      navigate("/my-profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Edit Profile</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label>
          Skills:
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Education:
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Experience:
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          About Me:
          <textarea
            name="about_me"
            value={formData.about_me}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </label>

        <label>
          Resume:
          <input type="file" name="resume" onChange={handleChange} />
        </label>

        <button type="submit" style={styles.button}>
          Update Profile
        </button>
      </form>
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "500px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EditProfile;
