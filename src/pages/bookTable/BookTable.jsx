import React, { useEffect, useState } from "react";
import { useToastr } from "../../components/toast/Toast";
import api from "../../components/action/Api";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaRegCommentDots
} from "react-icons/fa";
import { COMPANY_NAME } from "../../utills/string";
import { heroImages } from "../../utills/images";

const BookTable = () => {
  const { customToast } = useToastr();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    requests: ""
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, guests, date, time } = formData;

    if (!name || !email || !phone || !guests || !date || !time) {
      customToast({
        severity: "error",
        summary: "Missing Fields",
        detail: "Please fill out all required fields before submitting."
      });
      return;
    }

    window?.loadingStart?.();

    try {
      const response = await api.post("/reservations", formData);
      customToast({
        severity: "success",
        summary: "Reservation Confirmed",
        detail:
          response.message ||
          "Your table has been successfully reserved. We look forward to serving you!"
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
        requests: ""
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to process your reservation. Please try again.";
      customToast({
        severity: "error",
        summary: "Reservation Failed",
        detail: message
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${heroImages[currentImageIndex]})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        color: "white"
      }}
      className="hero-section"
    >
      <Container
        fluid
        className="hero-section text-white d-flex align-items-center px-3 px-md-5 py-5"
        style={{ minHeight: "100vh" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col
              xs={12}
              lg={8}
              className="hero-text mb-lg-0 text-center text-lg-start px-3"
            >
              <p className="text-uppercase text-warning fw-semibold mb-1">
                Make Every Meal Memorable
              </p>
              <h1 className="display-4 fw-bold mb-3">
                Reserve Your Table at {COMPANY_NAME}
              </h1>
              <p className="lead text-white">
                Whether it's a romantic dinner, a birthday, or a business lunch
                — enjoy a world-class dining experience with us. Reserve your
                spot today and let us serve you excellence.
              </p>
            </Col>

            <Col xs={12} lg={4} className="px-0 px-lg-3">
              <div className="reservation-form p-3 p-md-4 rounded-4 bg-transparent-mobile shadow-lg animate__animated animate__fadeInUp">
                <h3 className="fw-bold mb-4 text-center text-warning">
                  Book a Table
                </h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-2 mb-md-0">
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaUser className="me-2 text-dark" />
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          required
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaEnvelope className="me-2 text-dark" />
                        <Form.Control
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          required
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-2 mb-md-0">
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaPhoneAlt className="me-2 text-dark" />
                        <Form.Control
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              setFormData((prev) => ({
                                ...prev,
                                phone: value
                              }));
                            }
                          }}
                          placeholder="Phone Number"
                          required
                          maxLength={10}
                          pattern="[0-9]{10}"
                          title="Enter a 10-digit phone number"
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaUsers className="me-2 text-dark" />
                        <Form.Control
                          name="guests"
                          type="tel"
                          min={1}
                          max={10}
                          maxLength={2}
                          value={formData.guests}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (Number(value) >= 1 && Number(value) <= 10)
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                guests: value
                              }));
                            }
                          }}
                          placeholder="Number of Guests"
                          required
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-2 mb-md-0">
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaCalendarAlt className="me-2 text-dark" />
                        <Form.Control
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="d-flex align-items-center bg-light rounded px-2">
                        <FaClock className="me-2 text-dark" />
                        <Form.Control
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                          className="border-0 bg-transparent"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3 d-flex align-items-start bg-light rounded px-2 py-1">
                    <FaRegCommentDots className="me-2 text-dark mt-2" />
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requests"
                      value={formData.requests}
                      onChange={handleChange}
                      placeholder="Special requests (dietary needs, seating preferences)"
                      className="border-0 bg-transparent"
                    />
                  </Form.Group>

                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 fw-semibold text-white py-2"
                  >
                    ✅ Confirm My Reservation
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
};

export default BookTable;
