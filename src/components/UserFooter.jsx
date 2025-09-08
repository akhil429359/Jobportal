import React from 'react'
import { Link } from 'react-router-dom'

function UserFooter() {
  return (
    <>
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white mb-4">Company</h5>
                        <Link className="btn btn-link text-white-50" to="/UserAbout">About Us</Link>
                        <Link className="btn btn-link text-white-50" to="/UserContact">Contact Us</Link>
                        <Link className="btn btn-link text-white-50" to="/UserServices">Our Services</Link>
                        <Link className="btn btn-link text-white-50" to="/UserPrivacy">Privacy Policy</Link>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white mb-4">Quick Links</h5>
                        <Link className="btn btn-link text-white-50" to="/UserAbout">About Us</Link>
                        <Link className="btn btn-link text-white-50" to="/UserContact">Contact Us</Link>
                        <Link className="btn btn-link text-white-50" to="/UserServices">Our Services</Link>
                        <Link className="btn btn-link text-white-50" to="/UserPrivacy">Privacy Policy</Link>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white mb-4">Contact</h5>
                        <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                        <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
                        <div className="d-flex pt-2">
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-twitter"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-facebook-f"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-youtube"></i></Link>
                            <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-linkedin-in"></i></Link>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white mb-4">Newsletter</h5>
                        <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
                        <div className="position-relative mx-auto" style={{maxWidth: "400px"}}>
                            <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email"/>
                            <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <Link className="border-bottom" to="/">Job Entry</Link>, All Right Reserved. 
							
							Designed By <Link className="border-bottom" to="https://htmlcodex.com">HTML Codex</Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default UserFooter
