import React from 'react'
import { Link,useNavigate } from 'react-router-dom'

function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens (adjust keys if different)
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh");

    // Redirect to login page
    navigate("/login");
  };

  return(
    <> 

        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
            <Link to="/" className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
                <h1 className="m-0 text-primary">JobEntry</h1>
            </Link>
            <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto p-4 p-lg-0">
                    <Link to="/user-home" className="nav-item nav-link active">Home</Link>
                    <Link to="/job-list" className="nav-item nav-link">Jobs</Link>
                    <Link to="/groups-list" className="nav-item nav-link">Groups</Link>
                    <Link to="/user-list" className="nav-item nav-link">Users</Link>
                    <Link to="/my-profile" className="nav-item nav-link">MyProfile</Link>
                    <button onClick={handleLogout} className="nav-item nav-link btn btn-link" style={{ textDecoration: "none" }}>  Logout </button>
                </div>
                <Link to="/job-post" className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block">Post A Job<i className="fa fa-arrow-right ms-3"></i></Link>
            </div>
        </nav>
    </>
        
  )
}

export default UserNavbar
