import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function UserCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const predefinedCategories = [
    "Marketing",
    "Customer Service",
    "Human Resource",
    "Project Management",
    "Business Development",
    "Sales & Communication",
    "Teaching & Education",
    "Design & Creative",
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("job-posts/");
        const jobs = res.data;

        // Create a category count map with random assignments
        const categoryMap = {};
        jobs.forEach((job) => {
          const randomCategory =
            predefinedCategories[
              Math.floor(Math.random() * predefinedCategories.length)
            ];

          if (!categoryMap[randomCategory]) {
            categoryMap[randomCategory] = 1;
          } else {
            categoryMap[randomCategory]++;
          }
        });

        // Convert object to array for rendering
        const categoryArray = predefinedCategories.map((cat) => ({
          name: cat,
          count: categoryMap[cat] || 0,
        }));

        setCategories(categoryArray);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
        Explore By Category
      </h1>
      <div className="row g-4">
        {categories.map((cat, index) => (
          <div
            key={cat.name}
            className="col-lg-3 col-sm-6 wow fadeInUp"
            data-wow-delay={`${0.1 * (index + 1)}s`}
          >
            <a
              className="cat-item rounded p-4"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/job-list`); 
              }}
            >
              <i className="fa fa-3x fa-briefcase text-primary mb-4"></i>
              <h6 className="mb-3">{cat.name}</h6>
              <p className="mb-0">{cat.count} Vacancy</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserCategory;
