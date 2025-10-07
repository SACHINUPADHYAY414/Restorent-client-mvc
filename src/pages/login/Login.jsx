import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../components/action/Api";
import { login } from "../../store/slice/authSlice";
import { useToastr } from "../../components/toast/Toast";

const formFields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    autoComplete: "username",
    validationMessage: "Please enter your email."
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
    validationMessage: "Please enter your password."
  }
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { customToast } = useToastr();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field of formFields) {
      if (!formData[field.id]) {
        customToast({
          severity: "warn",
          summary: "Validation Error",
          detail: field.validationMessage
        });
        return;
      }
    }

    try {
      window?.loadingStart?.();
      const response = await api.password({
        email: formData.email,
        password: formData.password
      });
      customToast({
        severity: "success",
        summary: "Success",
        detail: response.message || "Logged in successfully!"
      });
      dispatch(login(response.user));
      navigate("/");
    } catch (error) {
      customToast({
        severity: "error",
        summary: "Login Failed",
        detail: error.message
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  return (
    <section
      id="login"
      style={{
        minHeight: "94vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px"
      }}
    >
      <Card
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backgroundColor: "rgba(255, 248, 240, 0.95)",
          padding: "30px"
        }}
      >
        <h2
          className="mb-4 text-center"
          style={{
            fontFamily: "'Brush Script MT', cursive",
            fontWeight: "700",
            fontSize: "2.8rem",
            color: "#d35400",
            textShadow: "1px 1px 2px #ba4a00"
          }}
        >
          Welcome Back
        </h2>
        <Form onSubmit={handleSubmit}>
          {formFields.map(({ id, label, type, placeholder, autoComplete }) => (
            <Form.Group controlId={id} className="mb-1" key={id}>
              <Form.Label
              className="form-label"
              >
                {label}
              </Form.Label>
              <Form.Control
                type={type}
                placeholder={placeholder}
                value={formData[id]}
                onChange={handleChange}
                autoComplete={autoComplete}
                required
                className="form-control"
              />
            </Form.Group>
          ))}

          <Button
            variant="warning"
            type="submit"
            className="w-100 fw-semibold"
            style={{
              fontSize: "1.2rem",
              borderRadius: "50px",
              padding: "10px",
              boxShadow: "0 4px 12px rgba(211, 84, 0, 0.5)"
            }}
          >
            Login
          </Button>
        </Form>

        <div
          className="d-flex justify-content-between mt-3"
          style={{ fontSize: "0.9rem", color: "#6e2c00" }}
        >
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#d35400" }}
          >
            Register
          </Link>
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "#d35400" }}
          >
            Forgot Password?
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default Login;
