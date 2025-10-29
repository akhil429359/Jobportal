import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditMyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skills: "",
    education: "",
    experience: "",
    about_me: "",
    role: "jobseeker",
    resume: null,
    profile_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          resume: null,
          profile_image: profile.profile_image || null,
        });
        if (profile.profile_image) {
          setPreviewImage(profile.profile_image);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" || name === "profile_image") {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (name === "profile_image" && file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
    if (formData.resume) data.append("resume", formData.resume);
    if (formData.profile_image) data.append("profile_image", formData.profile_image);

    try {
      await api.patch(`user-profiles/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      navigate("/my-profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.heading}>Edit Profile</h2>
        <div style={styles.imageWrapper}>
          {previewImage ? (
            <img src={previewImage} alt="Preview" style={styles.profileImage} />
          ) : (
            <div style={styles.imagePlaceholder}>No Image</div>
          )}
          <input type="file" name="profile_image" accept="image/*" onChange={handleChange} style={styles.fileInput} />
        </div>
        <label style={styles.label}>
          Skills:
          <textarea name="skills" value={formData.skills} onChange={handleChange} style={styles.textarea} required />
        </label>
        <label style={styles.label}>
          Education:
          <textarea name="education" value={formData.education} onChange={handleChange} style={styles.textarea} required />
        </label>
        <label style={styles.label}>
          Experience:
          <textarea name="experience" value={formData.experience} onChange={handleChange} style={styles.textarea} required />
        </label>
        <label style={styles.label}>
          About Me:
          <textarea name="about_me" value={formData.about_me} onChange={handleChange} style={styles.textarea} required />
        </label>
        <label style={styles.label}>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        <label style={styles.label}>
          Resume:
          <input type="file" name="resume" onChange={handleChange} style={styles.fileInput} />
        </label>
        <button type="submit" style={styles.button}>Update Profile</button>
      </form>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5faff, #ffffff)",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "#fff",
    padding: "35px",
    borderRadius: "16px",
    border: "1px solid #ddd",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    width: "500px",
    maxWidth: "95%",
    transition: "all 0.3s ease",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.8rem",
    marginBottom: "10px",
    color: "#333",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  },
  imagePlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "2px dashed #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#aaa",
    fontSize: "0.9rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    color: "#555",
    fontSize: "0.95rem",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "vertical",
    minHeight: "60px",
    outline: "none",
    fontSize: "1rem",
    transition: "box-shadow 0.3s ease",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease",
  },
  fileInput: {
    marginTop: "5px",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(90deg, #007bff, #0056b3)",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease, transform 0.1s ease",
  },
};

export default EditMyProfile;
