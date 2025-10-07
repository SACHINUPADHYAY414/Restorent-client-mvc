import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import {
  COMPANY_NAME,
  COMPANY_NUMBER,
  COMPANY_EMAIL,
  COMPANY_LOCATION,
  RESTAURANT_ESTABLISHED_YEAR,
  COMPANY_CEO,
  SOCIAL_MEDIA_LINKS
} from "../../utills/string";

const Footer = () => {
  return (
    <footer className="footer-bg text-white pb-2">
      <div className="container mx-auto text-center text-md-start">
        <div className="row py-1 py-md-3 gy-2">
          {/* Our Restaurant */}
          <div className="col-12 col-md-4">
            <h6 className="text-uppercase fw-bold mb-2 fs-7 fs-md-6">
              Our {COMPANY_NAME}
            </h6>
            <p className="fs-7 fs-md-6 mb-0">
              Serving delicious food with fresh ingredients. Cozy atmosphere and
              friendly staff.
            </p>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-3 d-flex flex-column">
            <h6 className="text-uppercase fw-bold mb-2 fs-7 fs-md-6">
              Contact
            </h6>
            <span className="fs-7 fs-md-6 mb-1 d-flex justify-content-center justify-content-md-start align-items-center">
              <FaMapMarkerAlt
                className="me-1"
                style={{ fontSize: "0.8rem" }}
                aria-hidden="true"
              />
              {COMPANY_LOCATION}
            </span>

            <span className="fs-7 fs-md-6 mb-1 d-flex justify-content-center justify-content-md-start align-items-center">
              <FaPhone
                className="me-1"
                style={{ fontSize: "0.8rem" }}
                aria-hidden="true"
              />
              {COMPANY_NUMBER}
            </span>

            <span className="fs-7 fs-md-6 d-flex justify-content-center justify-content-md-start align-items-center">
              <FaEnvelope
                className="me-1"
                style={{ fontSize: "0.8rem" }}
                aria-hidden="true"
              />
              {COMPANY_EMAIL}
            </span>
          </div>

          {/* Opening Hours */}
          <div className="col-12 col-md-3 d-flex flex-column">
            <h6 className="text-uppercase fw-bold mb-2 fs-7 fs-md-6">
              Opening Hours
            </h6>
            <span className="fs-7 fs-md-6 mb-1">
              Mon - Fri: 9:00 AM - 10:00 PM
            </span>
            <span className="fs-7 fs-md-6">Sat - Sun: 10:00 AM - 11:00 PM</span>
          </div>

          {/* Social Media */}
          <div className="col-12 col-md-2 text-center text-md-start">
            <h6 className="text-uppercase fw-bold mb-2 fs-7 fs-md-6">
              Follow Us
            </h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href={SOCIAL_MEDIA_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-white"
                style={{ fontSize: "0.9rem" }}
              >
                <FaFacebookF />
              </a>
              <a
                href={SOCIAL_MEDIA_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-white"
                style={{ fontSize: "0.9rem" }}
              >
                <FaInstagram />
              </a>
              <a
                href={SOCIAL_MEDIA_LINKS.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-white"
                style={{ fontSize: "0.9rem" }}
              >
                <FaTwitter />
              </a>
              <a
                href={SOCIAL_MEDIA_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-white"
                style={{ fontSize: "0.9rem" }}
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-1" />
        <div className="text-center small">
          &copy; {RESTAURANT_ESTABLISHED_YEAR} Our  {COMPANY_NAME}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
