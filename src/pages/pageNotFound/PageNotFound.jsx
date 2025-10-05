import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "50.2vh", padding: "4rem", textAlign: "center" }}
    >
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button onClick={goBack} className="btn btn-primary mt-3">
        Back
      </button>
    </div>
  );
};

export default PageNotFound;
