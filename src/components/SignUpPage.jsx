import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ first_name: "", last_name: "", username: "", email: "", password: "", role: "jobseeker" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("users/", formData);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } 
    catch (error) { setMessage(error.response?.data?.detail || "Signup failed. Check your input or try again."); } 
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #e3f2fd, #ffffff)", padding: "20px" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "35px", border: "1px solid #ddd", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", background: "#fff", width: "350px", transition: "all 0.3s ease" }}>
        <h2 style={{ textAlign: "center", color: "#333", fontSize: "1.8rem", marginBottom: "10px" }}>Create Account</h2>

        {["first_name", "last_name", "username", "email", "password"].map((field) => (
          <input key={field} type={field === "password" ? "password" : field === "email" ? "email" : "text"} name={field} placeholder={field === "first_name" ? "First Name" : field === "last_name" ? "Last Name" : field === "username" ? "Username" : field === "email" ? "Email" : "Password"} value={formData[field]} onChange={handleChange} required style={inputStyle} onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #2196F3")} onBlur={(e) => (e.target.style.boxShadow = "none")} />
        ))}

        <select name="role" value={formData.role} onChange={handleChange} required style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #2196F3")} onBlur={(e) => (e.target.style.boxShadow = "none")}>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit" disabled={loading} style={{ padding: "12px", border: "none", background: "linear-gradient(90deg, #4CAF50, #45a049)", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", transition: "background 0.3s ease, transform 0.1s ease" }} onMouseOver={(e) => (e.target.style.background = "linear-gradient(90deg, #45a049, #388e3c)")} onMouseOut={(e) => (e.target.style.background = "linear-gradient(90deg, #4CAF50, #45a049)")} onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")} onMouseUp={(e) => (e.target.style.transform = "scale(1)")}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        {message && <p style={{ textAlign: "center", color: message.includes("successful") ? "green" : "red", fontSize: "14px", marginTop: "5px" }}>{message}</p>}
      </form>
    </div>
  );
};

const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontSize: "1rem", transition: "border-color 0.3s ease, box-shadow 0.3s ease", boxSizing: "border-box" };

export default SignupPage;
