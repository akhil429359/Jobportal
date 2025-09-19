import React, { useState } from "react";
import api from "../api/axios";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      await api.post("contact/", formData);
      setStatus({ loading: false, success: "Message sent successfully!", error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ loading: false, success: null, error: "Failed to send message. Please try again!" });
      console.error(error);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <h1 className="text-center mb-5">Contact For Any Query</h1>
        <div className="row g-4">
          <div className="col-md-6">
            <iframe className="position-relative rounded w-100 h-100" src="https://www.google.com/maps/embed?pb=..." frameBorder="0" style={{ minHeight: "400px", border: "0" }} allowFullScreen aria-hidden="false" tabIndex="0"></iframe>
          </div>
          <div className="col-md-6">
            {status.success && <div className="alert alert-success">{status.success}</div>}
            {status.error && <div className="alert alert-danger">{status.error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                    <label htmlFor="name">Your Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                    <label htmlFor="email">Your Email</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                    <label htmlFor="subject">Subject</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: "150px" }} value={formData.message} onChange={handleChange} required></textarea>
                    <label htmlFor="message">Message</label>
                  </div>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100 py-3" type="submit" disabled={status.loading}>{status.loading ? "Sending..." : "Send Message"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
