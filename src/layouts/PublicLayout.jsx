import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <>
      <UserNavbar/>
      <Outlet /> {/* 👈 Renders the matched child route */}
      <Footer/>
    </>
  );
};

export default PublicLayout;
