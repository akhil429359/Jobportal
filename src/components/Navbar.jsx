import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5"
      >
        <h1 className="m-0 text-primary">JobEntry</h1>
      </Link>

      <button
        type="button"
        className="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0 d-flex align-items-center gap-4">
          <Link to="/" className="nav-item nav-link custom-link">
            Home
          </Link>
          <Link to="/About" className="nav-item nav-link custom-link">
            About
          </Link>
          <Link to="/Contact" className="nav-item nav-link custom-link">
            Contact
          </Link>
          <Link to="/SignUp" className="nav-item nav-link custom-link">
            SignUp
          </Link>
          <Link to="/Login" className="nav-item nav-link custom-link">
            Login
          </Link>
        </div>

        <Link
          to="/SignUp"
          className="btn btn-primary apply-job-btn d-none d-lg-block"
        >
          Apply For Job <i className="fa fa-arrow-right ms-3"></i>
        </Link>
      </div>

      <style>{`
        .custom-link {
          font-weight: 700 !important;
          font-size: 1.2rem !important;
          color: #333 !important;
          position: relative;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .custom-link:hover {
          color: #078f44ff !important;
          transform: scale(1.05);
        }
        .custom-link::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          left: 0;
          bottom: -2px;
          background-color: #078f44ff;
          transition: width 0.3s ease;
        }
        .custom-link:hover::after {
          width: 100%;
        }
        .apply-job-btn {
          font-size: 1.3rem;
          font-weight: 700;
          padding: 14px 30px;
          background-color: #078f44ff !important;
          border: none;
          border-radius: 12px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .apply-job-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
