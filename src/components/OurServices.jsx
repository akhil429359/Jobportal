import React from "react";

function OurServices() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="mb-3">Our Services</h1>
          <p className="text-muted">
            We provide the best career opportunities for job seekers and top
            talent for employers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="row g-4">
          {/* Service 1 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-search text-primary"></i>
              </div>
              <h5>Job Search</h5>
              <p>
                Browse thousands of job listings from verified companies and
                find your dream job with ease.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-building text-primary"></i>
              </div>
              <h5>Employer Services</h5>
              <p>
                Employers can post jobs, manage applications, and hire the best
                candidates quickly.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-users text-primary"></i>
              </div>
              <h5>Career Guidance</h5>
              <p>
                Get expert tips, resume reviews, and career counseling to help
                you succeed in your job search.
              </p>
            </div>
          </div>

          {/* Service 4 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-chalkboard-teacher text-primary"></i>
              </div>
              <h5>Skill Training</h5>
              <p>
                Enhance your skills with online training programs designed for
                today’s job market.
              </p>
            </div>
          </div>

          {/* Service 5 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-handshake text-primary"></i>
              </div>
              <h5>Internships</h5>
              <p>
                Find valuable internship opportunities to gain practical
                experience and grow your career.
              </p>
            </div>
          </div>

          {/* Service 6 */}
          <div className="col-lg-4 col-md-6">
            <div className="service-item bg-light rounded p-4 h-100 text-center">
              <div className="mb-3">
                <i className="fa fa-3x fa-globe text-primary"></i>
              </div>
              <h5>Global Jobs</h5>
              <p>
                Access international job listings and explore opportunities
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurServices;
