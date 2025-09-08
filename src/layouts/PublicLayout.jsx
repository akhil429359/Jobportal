import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

const PublicLayout = () => {
  return (
    <>
    <Navbar/>
      <Outlet /> {/* 👈 Renders the matched child route */}
      <Footer/>
    </>
  );
};

export default PublicLayout;
