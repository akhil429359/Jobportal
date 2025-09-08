// src/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("users/", formData); // signup
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Signup failed. Check your input or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          background: "#fff",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Signup</h2>

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            border: "none",
            background: "#4CAF50",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        {message && (
          <p style={{ textAlign: "center", color: "red", fontSize: "14px" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;
