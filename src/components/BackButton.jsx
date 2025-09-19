import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function BackButton({ to = null }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const baseStyle = {
    position: "fixed",
    top: 80,
    left: 20,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 16px",
    background: "#ffffff",
    color: "#333",
    border: "none",
    borderRadius: 30,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease",
  };

  const hoverStyle = {
    background: "#2196f3",
    color: "#fff",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  };

  return (
    <button onClick={handleClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...baseStyle, ...(hover ? hoverStyle : {}) }}>
      <IoArrowBack size={18} /> Back
    </button>
  );
}

export default BackButton;
