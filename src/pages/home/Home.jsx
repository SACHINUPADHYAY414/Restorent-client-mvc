import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { COMPANY_LOCATION, COMPANY_NAME } from "../../utills/string";
import About from "../about/About";
import Menu from "../menu/Menu";
import Event from "../event/Event.jsx";
import Testimonial from "../testimonial/Testimonial.jsx";
import Gallery from "../gallery/Gallery.jsx";
import api from "../../components/action/Api.js";
import { heroImages } from "../../utills/images.js";
import { useToastr } from "../../components/toast/Toast.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { customToast } = useToastr();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    requests: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window?.loadingStart?.();

    try {
      const response = await api.post("/reservations", formData);
      customToast({
        severity: "success",
        summary: "Success",
        detail:
          response.message ||
          "Reservation successful! We look forward to seeing you."
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
        "Failed to submit reservation. Please try again.";
      customToast({
        severity: "success",
        summary: "Success",
        detail: message
      });
    } finally {
      window?.loadingEnd?.();
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-section">
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
            <Row className="justify-content-center mt-4 mt-md-0">
              <Col
                xs={12}
                lg={8}
                className="hero-text mb-2 mb-lg-0 text-center text-lg-start px-3"
              >
                <p className="text-uppercase text-warning fw-semibold mb-0">
                  Experience Culinary Excellence
                </p>
                <h1 className="display-4 fw-bold mb-2">
                  Savor Every Moment at {COMPANY_NAME}
                </h1>
                <p className="mb-3 text-white">
                  Indulge in authentic Italian cuisine crafted with passion and
                  the finest ingredients. From traditional recipes passed down
                  through generations to innovative culinary creations, we offer
                  an unforgettable dining experience.
                </p>

                <div className="mb-3 d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                  <Button
                    variant="warning"
                    className="fw-semibold text-white px-4 py-2"
                    onClick={() => navigate("/book")}
                  >
                    Book a Table
                  </Button>
                  <Button
                    variant="outline-light"
                    className="px-4 py-2"
                    onClick={() => navigate("/menu")}
                  >
                    View Menu
                  </Button>
                </div>

                <div className="d-flex d-none d-md-flex flex-column flex-md-row align-items-center justify-content-center justify-content-lg-start gap-3 text-center text-md-start mobile-text-small">
                  <div className="d-flex align-items-start gap-2">
                    <FaClock className="text-warning icon-align" />
                    <div>
                      <strong>OPEN DAILY</strong>
                      <p className="m-0">11:00 AM - 11:00 PM</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <FaMapMarkerAlt className="text-warning icon-align" />
                    <div>
                      <strong>LOCATION</strong>
                      <p className="m-0">{COMPANY_LOCATION}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <FaPhoneAlt className="text-warning icon-align" />
                    <div>
                      <strong>RESERVATIONS</strong>
                      <p className="m-0">+1 (312) 555-0198</p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} lg={4} className="px-0 px-lg-3">
                <div className="reservation-form p-4 rounded-4 bg-dark bg-opacity-75">
                  <h3 className="fw-bold mb-4 text-center">
                    Make a Reservation
                  </h3>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          required
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Control
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your Email"
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} md={6} className="mb-2 mb-md-0">
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
                          placeholder="Your Phone"
                          required
                          maxLength={10}
                          pattern="[0-9]{10}"
                          title="Please enter a valid 10-digit phone number"
                        />
                      </Col>
                      <Col xs={12} md={6}>
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
                          placeholder="No. of Guests"
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <Form.Control
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Control
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Row>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requests"
                      value={formData.requests}
                      onChange={handleChange}
                      placeholder="Special requests (e.g., dietary needs, seating preference)"
                      className="mb-3"
                    />
                    <Button
                      variant="warning"
                      type="submit"
                      className="w-100 fw-semibold text-white py-2"
                    >
                      Reserve Now
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </section>

      <section id="about">
        <About />
      </section>
      <section id="menu">
        <Menu />
      </section>
      <section id="testimonial">
        <Testimonial />
      </section>
      <section id="events">
        <Event />
      </section>

      <section id="gallery">
        <Gallery />
      </section>
    </div>
  );
};

export default Home;
