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
  COMPANY_EMAIL,
  COMPANY_LOCATION,
  COMPANY_NUMBER,
  RESTAURANT_ESTABLISHED_YEAR
} from "../../utills/string";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-2">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-3">
            <h5 className="text-uppercase fw-bold mb-4">Our Restaurant</h5>
            <p>
              Serving delicious food with fresh ingredients. Cozy atmosphere and
              friendly staff.
            </p>
          </div>

          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-3">
            <h5 className="text-uppercase fw-bold mb-4">Contact</h5>
            <p>
              <FaMapMarkerAlt className="me-1" /> {COMPANY_LOCATION}
            </p>
            <p>
              <FaPhone className="me-1" /> {COMPANY_NUMBER}
            </p>
            <p>
              <FaEnvelope className="me-1" /> {COMPANY_EMAIL}
            </p>
          </div>

        
          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-3">
            <h5 className="text-uppercase fw-bold mb-4">Opening Hours</h5>
            <p>Mon - Fri: 9:00 AM - 10:00 PM</p>
            <p>Sat - Sun: 10:00 AM - 11:00 PM</p>
          </div>

          {/* Social Media */}
          <div className="col-md-12 col-lg-12 col-xl-3 mx-auto mb-3 text-center text-md-start">
            <h5 className="text-uppercase fw-bold mb-4">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-white"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-white"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <hr className="mb-1" />
        <div className="text-center">
          &copy; {RESTAURANT_ESTABLISHED_YEAR} Our Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
