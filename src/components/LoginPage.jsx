import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await api.post("token-auth/", formData);
      const token = response.data.token;
      localStorage.setItem("access_token", token);
      navigate("/user-home");
    } 
    catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.non_field_errors?.[0] || "Login failed. Check your credentials.");
    } 
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #e3f2fd, #ffffff)", padding: "20px" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "35px", border: "1px solid #ddd", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", background: "#fff", width: "350px", transition: "all 0.3s ease" }}>
        <h2 style={{ textAlign: "center", color: "#333", fontSize: "1.8rem", marginBottom: "10px" }}>Welcome Back</h2>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={inputStyle} onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #2196F3")} onBlur={(e) => (e.target.style.boxShadow = "none")} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyle} onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #2196F3")} onBlur={(e) => (e.target.style.boxShadow = "none")} />
        <button type="submit" disabled={loading} style={{ padding: "12px", border: "none", background: "linear-gradient(90deg, #4CAF50, #45a049)", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", transition: "background 0.3s ease, transform 0.1s ease" }} onMouseOver={(e) => (e.target.style.background = "linear-gradient(90deg, #45a049, #388e3c)")} onMouseOut={(e) => (e.target.style.background = "linear-gradient(90deg, #4CAF50, #45a049)")} onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")} onMouseUp={(e) => (e.target.style.transform = "scale(1)")}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && <p style={{ textAlign: "center", color: message.includes("failed") ? "red" : "green", fontSize: "14px", marginTop: "5px" }}>{message}</p>}
      </form>
    </div>
  );
};

const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontSize: "1rem", transition: "border-color 0.3s ease, box-shadow 0.3s ease", boxSizing: "border-box" };

export default LoginPage;
