import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
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
                    <Link to="/" className="nav-item nav-link active">Home</Link>
                    <Link to="/About" className="nav-item nav-link">About</Link>
                    <Link to="/Contact" className="nav-item nav-link">Contact</Link>
                    <Link to="/SignUp" className="nav-item nav-link">SignUp</Link>
                    <Link to="/Login" className="nav-item nav-link">Login</Link>
                </div>
                <Link to="" className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block">Post A Job<i className="fa fa-arrow-right ms-3"></i></Link>
            </div>
        </nav>
    </>
        
  )
}

export default Navbar
