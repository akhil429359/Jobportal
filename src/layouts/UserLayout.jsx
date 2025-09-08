// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import UserFooter from "../components/UserFooter";

const UserLayout = () => {
  return (
    <>
      < UserNavbar/>   {/* 👈 Different navbar for logged-in users */}
      <main style={{ padding: "20px" }}>
        <Outlet />     {/* 👈 This is where child pages (UserHome, Profile, etc.) render */}
      </main>
      <UserFooter/>
    </>
  );
};

export default UserLayout;
