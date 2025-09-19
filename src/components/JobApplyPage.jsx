import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const JobApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await api.get(`job-posts/${jobId}/`);
        setJob(res.data);
        const initialAnswers = {};
        (res.data.questions || []).forEach((q) => { initialAnswers[q] = ""; });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Error fetching job details:", err.response?.data || err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleChange = (question, value) => { setAnswers((prev) => ({ ...prev, [question]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("applications/", { job_id: Number(jobId), answers });
      alert("✅ Application submitted successfully!");
      navigate("/user-home");
    } catch (err) {
      console.error("Application error:", err.response?.data || err);
      if (err.response?.status === 400 && err.response?.data) {
        const messages = Object.entries(err.response.data)
          .map(([field, msgs]) => Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${msgs}`)
          .join("\n");
        alert(`❌ Failed to apply:\n${messages}`);
      } else if (err.response?.status === 404) {
        alert("❌ The job or applications endpoint was not found.");
      } else {
        alert("❌ Something went wrong while applying. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading job details...</p>;
  if (!job) return <p className="text-center mt-4 text-red-600">Job not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg border mt-8 bg-white">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="mb-4">{job.description}</p>
      <p className="mb-2 font-medium">📍 Location: {job.location}</p>
      <p className="mb-4 font-medium">💰 Salary: {job.salary_range}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {job.questions && job.questions.length > 0 ? (
          job.questions.map((q, index) => (
            <div key={index}>
              <label className="block mb-1 font-medium">{q}</label>
              <input type="text" className="w-full p-2 border rounded focus:ring focus:ring-blue-300" value={answers[q] || ""} onChange={(e) => handleChange(q, e.target.value)} required />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No questions for this job. You can submit your application directly.</p>
        )}
        <button type="submit" disabled={submitting} className={`w-full px-4 py-2 rounded text-white ${submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
          {submitting ? "Submitting..." : "Apply"}
        </button>
      </form>
    </div>
  );
};

export default JobApplyPage;
