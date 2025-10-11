import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "61vh" }}
    >
      <div className="text-center">
        <h1 className="mb-2 fw-bold">Welcome to Dashboard</h1>
        <p className="lead">
          <i className="bi bi-emoji-smile text-warning fs-5 me-2"></i>Hello, <strong>{user.name}</strong>!
        </p>
      </div>
    </div>
  );
};

export default Home;