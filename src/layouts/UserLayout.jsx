// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <>
      < UserNavbar/>   {/* 👈 Different navbar for logged-in users */}
      <main style={{ padding: "20px" }}>
        <Outlet />     {/* 👈 This is where child pages (UserHome, Profile, etc.) render */}
      </main>
      <Footer/>
    </>
  );
};

export default UserLayout;
