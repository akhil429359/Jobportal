import React from "react";
import { useNavigate } from "react-router-dom";

function Category() {
  const navigate = useNavigate();

  const handleCategoryClick = (e) => {
    e.preventDefault(); 
    navigate("/signup"); 
  };

  return (
    <div className="container">
      <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
        Explore By Category
      </h1>
      <div className="row g-4">
        {[
          { icon: "fa-mail-bulk", title: "Marketing" },
          { icon: "fa-headset", title: "Customer Service" },
          { icon: "fa-user-tie", title: "Human Resource" },
          { icon: "fa-tasks", title: "Project Management" },
          { icon: "fa-chart-line", title: "Business Development" },
          { icon: "fa-hands-helping", title: "Sales & Communication" },
          { icon: "fa-book-reader", title: "Teaching & Education" },
          { icon: "fa-drafting-compass", title: "Design & Creative" },
        ].map((category, index) => (
          <div
            key={index}
            className="col-lg-3 col-sm-6 wow fadeInUp"
            data-wow-delay={`${0.1 * (index % 4)}s`}
          >
            <a
              href="#"
              className="cat-item rounded p-4"
              onClick={handleCategoryClick}
            >
              <i
                className={`fa fa-3x ${category.icon} text-primary mb-4`}
              ></i>
              <h6 className="mb-3">{category.title}</h6>
              <p className="mb-0">123 Vacancy</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
