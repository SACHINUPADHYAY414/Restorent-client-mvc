import React, { useEffect, useState } from "react";
import { FaAward, FaTrophy } from "react-icons/fa";
import { restroImg } from "../../utills/images";
import {
  COMPANY_CEO,
  COMPANY_NAME,
  RESTAURANT_ESTABLISHED_YEAR
} from "../../utills/string";

const About = () => {
  const currentYear = new Date().getFullYear();
  const yearsOfDedication = currentYear - RESTAURANT_ESTABLISHED_YEAR;

  const [animatedYears, setAnimatedYears] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = Math.max(Math.floor(duration / yearsOfDedication), 30);

    const interval = setInterval(() => {
      start += 1;
      setAnimatedYears(start);
      if (start >= yearsOfDedication) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [yearsOfDedication]);

  return (
    <section className="about-section py-3 py-md-3" style={{minHeight:"80vh"}}>
      <div className="container">
      <div className="heading-wrapper text-center">
          <h2 className="background-text">About</h2>
          <h2 className="foreground-text">About</h2>
        </div>
        <p className="text-center text-muted mb-0 mb-md-4 fw-semibold">
          Discover the rich flavours, warm hospitality, and timeless traditions
          that define our restaurant.
        </p>

        <div className="row align-items-start">
          <div className="col-md-6">
            <h3 className="fw-bold mb-2 text-center text-md-start">Experience Our Unique Indian Touch</h3>
            <p className="fst-italic">
              From North Indian spices to South Indian delicacies, every dish is
              prepared with love and authenticity.
            </p>
            <p>
              We believe in offering not just food, but an experience — where
              every bite takes you home. Our chefs bring years of experience and
              a passion for Indian cuisine that reflects in every plate served.
            </p>

            <div className="d-flex flex-column flex-md-row gap-3 mt-4">
              <div className="card p-3 shadow-sm flex-fill">
                <div className="mb-2 text-primary">
                  <FaAward size={24} />
                </div>
                <h5 className="fw-bold">Unmatched Hospitality</h5>
                <p className="text-muted mb-0">
                  We treat every guest like family, ensuring your visit is
                  comfortable and memorable.
                </p>
              </div>

              <div className="card p-3 shadow-sm flex-fill">
                <div className="mb-2 text-warning">
                  <FaTrophy size={24} />
                </div>
                <h5 className="fw-bold">Recognised Excellence</h5>
                <p className="text-muted mb-0">
                  Proud to be honoured for our service and taste by food lovers
                  and critics alike.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <em>
                {COMPANY_CEO}, Head of {COMPANY_NAME}
              </em>
              <div className="signature">{COMPANY_CEO}</div>
            </div>
          </div>

          <div className="col-md-6 mt-1 mt-md-0">
            <div className="row g-3">
              <div className="col-6">
                <img
                  src={restroImg.restro1}
                  className="img-fluid rounded"
                  alt="Traditional Indian Dining"
                  style={{ height: "180px", objectFit: "cover", width: "100%" }}
                />
              </div>

              <div className="col-6">
                <img
                  src={restroImg.restro2}
                  className="img-fluid rounded"
                  alt="Indian Dinner Table Setup"
                  style={{ height: "180px", objectFit: "cover", width: "100%" }}
                />
              </div>

              <div className="col-12 position-relative">
                <img
                  src={restroImg.restro3}
                  className="img-fluid rounded w-100"
                  alt="Elegant Decor"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="years-box position-absolute bottom-0 end-0 d-flex flex-column align-items-center justify-content-center p-3 fw-bold text-center">
                  <div className="fs-2">{animatedYears}</div>
                  <div className="small">Years of Dedication</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
