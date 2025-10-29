import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import api from "../api/axios";

function UserNavbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("user-profiles/");
        if (res.data.length > 0) {
          setRole(res.data[0].role);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link
        to="/user-home"
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
        <NotificationBell />
        <div className="navbar-nav ms-auto p-4 p-lg-0 d-flex align-items-center gap-4">
          <Link to="/user-home" className="nav-item nav-link custom-link">
            Home
          </Link>

          {/* Show Jobs link only if user is jobseeker */}
          {role === "jobseeker" && (
            <Link to="/job-list" className="nav-item nav-link custom-link">
              Jobs
            </Link>
          )}

          <Link to="/groups-list" className="nav-item nav-link custom-link">
            Groups
          </Link>
          <Link to="/user-list" className="nav-item nav-link custom-link">
            Users
          </Link>

          {role === "employer" && (
            <Link to="/my-jobs" className="nav-item nav-link custom-link">
              My Posted Jobs
            </Link>
          )}

          <Link to="/my-profile" className="nav-item nav-link custom-link">
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="nav-item nav-link btn btn-link custom-link"
            style={{ textDecoration: "none" }}
          >
            Logout
          </button>
        </div>

        <Link
          to="/job-post"
          className="btn btn-primary post-job-btn d-none d-lg-block"
        >
          Post A Job <i className="fa fa-arrow-right ms-3"></i>
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
        .post-job-btn {
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
        .post-job-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
}

export default UserNavbar;
