import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitterX
} from "react-icons/bs";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_NUMBER
} from "../../utills/string";

const Header = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setShowOffcanvas(false);
  };

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // run once
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderNavLinks = () => (
    <Nav className="flex-column flex-md-row align-items-start fw-semibold align-items-md-center">
      <Nav.Link
        as={NavLink}
        to="/"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Home
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        About
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/menu"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Menu
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/book"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Book a Table
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/chefs"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Chefs
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/events"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Events
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/contact"
        className={({ isActive }) =>
          isActive ? "text-warning fw-bold" : "text-white"
        }
        onClick={() => setShowOffcanvas(false)}
      >
        Contact
      </Nav.Link>

      {isAuthenticated ? (
        <>
          <Nav.Link
            onClick={handleLogout}
            className="text-warning fw-semibold ms-lg-3"
          >
            Logout
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-warning fw-bold ms-lg-2" : "text-white ms-lg-2"
            }
            onClick={() => setShowOffcanvas(false)}
          >
            Dashboard
          </Nav.Link>
        </>
      ) : (
        <Nav.Link
          as={NavLink}
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-bold ms-lg-3"
              : "text-warning fw-semibold ms-lg-3"
          }
          onClick={() => setShowOffcanvas(false)}
        >
          Login
        </Nav.Link>
      )}
    </Nav>
  );

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className={`navbar-dark px-4 smooth-navbar ${
          isFixed || location.pathname !== "/"
            ? "bg-black shadow-sm"
            : "bg-transparent"
        } ${showOffcanvas ? "mb-1" : ""}`}
      >
        <Container className="transition-container">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
            {COMPANY_NAME}
          </Navbar.Brand>

          <Button
            className="d-lg-none text-white border-0"
            onClick={() => setShowOffcanvas(true)}
          >
            ☰
          </Button>

          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            {renderNavLinks()}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        className="bg-black text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>{COMPANY_NAME}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderNavLinks()}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
