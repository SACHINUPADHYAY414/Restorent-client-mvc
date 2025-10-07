import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_NUMBER
} from "../../utills/string";

const navItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "menu", label: "Menu", path: "/menu" },
  { id: "book", label: "Book a Table", path: "/book" },
  { id: "gallery", label: "Gallery", path: "/gallery" }
];

const Header = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setShowOffcanvas(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = Array.from(document.querySelectorAll("section[id]"));

    const onScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSectionId = "";

      for (const section of sections) {
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          currentSectionId = section.id;
          break;
        }
      }
      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      const hash = location.hash.replace("#", "");
      if (hash) {
        const section = document.getElementById(hash);
        if (section) {
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth" });
            setActiveSection(hash);
          }, 100);
        }
      }
    }
  }, [location]);

  const handleNavLinkClick = (path) => {
    navigate(path);
    setShowOffcanvas(false);
  };

  const renderNavLinks = () => (
    <Nav className="flex-column flex-md-row align-items-start fw-semibold align-items-md-center">
      {navItems.map((item) => {
        return location.pathname === "/" ? (
          <Nav.Link
            key={item.id}
            as="button"
            type="button"
            className={`nav-link ${
              activeSection === item.id
                ? "active-link text-warning"
                : "text-white"
            }`}
            onClick={() => handleNavLinkClick(item.path)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            {item.label}
          </Nav.Link>
        ) : (
          <Nav.Link
            as={NavLink}
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active-link text-warning" : "text-white"
            }
            onClick={() => setShowOffcanvas(false)}
          >
            {item.label}
          </Nav.Link>
        );
      })}

      {isAuthenticated && (
        <>
          <Nav.Link
            onClick={handleLogout}
            className="text-warning fw-semibold d-none d-lg-block"
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
      )}

      {!isAuthenticated && window.innerWidth >= 992 && (
        <Nav.Link
          as={NavLink}
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-warning fw-semibold d-none d-lg-block"
              : "text-white fw-semibold d-none d-lg-block"
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
        className={`navbar-dark smooth-navbar ${
          isFixed || location.pathname !== "/"
            ? "navbar-bg"
            : "bg-transparent"
        } ${showOffcanvas ? "mb-1" : ""}`}
      >
        <Container className="transition-container mb-1">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
            {COMPANY_NAME}
          </Navbar.Brand>
          <Button
            variant="outline-light"
            className="d-lg-none d-flex justify-content-center align-items-center"
            style={{ height: "2rem", width: "2rem" }}
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
        className="text-white"
        style={{ backgroundColor: "#0d1117" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-semibold">{COMPANY_NAME}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <div>{renderNavLinks()}</div>

          {!isAuthenticated && (
            <div className="d-lg-none mt-auto px-3 pb-3">
              <Button
                variant="warning"
                className="w-100 fw-semibold"
                onClick={() => {
                  navigate("/login");
                  setShowOffcanvas(false);
                }}
              >
                Login
              </Button>
            </div>
          )}

          {isAuthenticated && (
            <div className="position-relative mt-auto">
              <Button
                variant="outline-warning"
                className="position-absolute bottom-0 end-0 m-3"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
