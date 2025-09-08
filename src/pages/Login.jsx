// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      const response = await api.post("token-auth/", formData); // login endpoint
      const token = response.data.token;
      localStorage.setItem("access_token", token);
      navigate("/user-home");  // redirect after login


    } catch (error) {
      console.log(error.response?.data);
      setMessage(
        error.response?.data?.non_field_errors?.[0] ||
          "Login failed. Check your credentials."
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
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
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
          {loading ? "Logging in..." : "Login"}
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

export default Login;
