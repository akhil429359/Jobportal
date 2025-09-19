import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const MyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({ skills: "", education: "", experience: "", about_me: "", resume: null, profile_image: null });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("user-profiles/");
        if (response.data.length > 0) setProfile(response.data[0]);
      } 
      catch (err) { console.error("Error fetching profile:", err); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const viewResume = async () => {
    if (!profile?.resume) return;
    try {
      const response = await api.get(`user-profiles/${profile.id}/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", profile.resume.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } 
    catch (err) { console.error("Error downloading resume:", err); }
  };

  const handleSwitchRole = async () => {
    if (!profile) return;
    const newRole = profile.role.toLowerCase() === "jobseeker" ? "employer" : "jobseeker";

    try {
      const form = new FormData();
      form.append("role", newRole);

      const response = await api.patch(
        `user-profiles/${profile.id}/`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(response.data);
      alert(`Switched role to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}!`);
      navigate(0);
    } catch (err) {
      console.error("Error switching role:", err);
      alert("Failed to switch role.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "profile_image") {
        setPreviewImage(URL.createObjectURL(files[0]));
        if (profile) handleProfileImageUpload(files[0]);
      }
    } 
    else setFormData({ ...formData, [name]: value });
  };

  const handleProfileImageUpload = async (file) => {
    if (!profile) return;
    try {
      const form = new FormData();
      form.append("profile_image", file);
      const response = await api.patch(`user-profiles/${profile.id}/`, form, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile(response.data);
    } 
    catch (err) {
      console.error("Error uploading profile image:", err);
      alert("Failed to upload profile image.");
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) if (formData[key]) form.append(key, formData[key]);
    try {
      const response = await api.post("user-profiles/", form, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile(response.data);
      setShowForm(false);
    } 
    catch (err) { console.error("Error creating profile:", err); }
  };

  if (loading) return <div>Loading...</div>;

  if (profile)
    return (
      <div style={styles.container}>
        <h2>My Profile</h2>
        <div style={styles.card}>
          <div style={styles.imageWrapper}>
            {(previewImage || profile.profile_image) ? (
              <img src={previewImage || profile.profile_image} alt="Profile" style={styles.profileImage} />
            ) : (
              <label style={styles.imagePlaceholder}>
                <span style={styles.plusIcon}>+</span>
                <input type="file" accept="image/*" name="profile_image" style={{ display: "none" }} onChange={handleChange} />
              </label>
            )}
          </div>

          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            <strong>About Me:</strong> {profile.about_me}
          </p>

          {profile.resume ? (
            <button style={{ ...styles.button, backgroundColor: "#4CAF50", width: "fit-content" }} onClick={viewResume}>View Resume</button>
          ) : (
            <p><strong>Resume:</strong> None</p>
          )}
          <button style={{ ...styles.button, width: "100%", marginTop: "20px", backgroundColor: "#388E3C" }} onClick={() => navigate(`/edit-profile/${profile.id}`)}>Edit Profile</button>
          <button style={{ ...styles.button, width: "100%", marginTop: "10px", backgroundColor: "#0b0ff7ff" }} onClick={handleSwitchRole}>
            {profile.role.toLowerCase() === "jobseeker" ? "Switch to Employer" : "Switch to Jobseeker"}
          </button>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      {!showForm ? (
        <button style={{ ...styles.button, backgroundColor: "#4CAF50" }} onClick={() => setShowForm(true)}>Create New Profile</button>
      ) : (
        <form onSubmit={handleCreateProfile} style={styles.card}>
          <label>Profile Image</label>
          <input type="file" name="profile_image" accept="image/*" onChange={handleChange} />
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
          <button type="submit" style={{ ...styles.button, backgroundColor: "#4CAF50" }}>Save Profile</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" },
  card: { border: "1px solid #ddd", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "500px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" },
  imageWrapper: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" },
  profileImage: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "3px solid #4CAF50" },
  imagePlaceholder: { width: "120px", height: "120px", borderRadius: "50%", border: "2px dashed #4CAF50", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" },
  plusIcon: { fontSize: "2rem", fontWeight: "bold", color: "#4CAF50" },
  button: { padding: "10px 16px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", transition: "background 0.3s ease" },
};

export default MyProfilePage;
