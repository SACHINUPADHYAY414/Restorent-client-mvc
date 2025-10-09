import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import { COMPANY_NAME } from "../../utills/string";
import { FaRegCircleUser } from "react-icons/fa6";

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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userMenuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setShowOffcanvas(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const renderNavLinks = () => {
    const updatedNavItems = [...navItems];
    if (isAuthenticated) {
      updatedNavItems.splice(1, 0, {
        id: "profile",
        label: "Profile",
        path: "/profile"
      });
    }

    return (
      <Nav className="flex-column flex-md-row align-items-start fw-semibold align-items-md-center">
        {updatedNavItems.map((item) => {
          const isDesktop = window.innerWidth >= 768;
          const hideProfileOnDesktop = isDesktop && item.label === "Profile";

          return location.pathname === "/" ? (
            <Nav.Link
              key={item.id}
              as="button"
              type="button"
              className={`nav-link ${
                activeSection === item.id
                  ? "active-link text-warning"
                  : "text-white"
              } ${hideProfileOnDesktop ? "d-none" : ""}`}
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
                (isActive ? "active-link text-warning" : "text-white") +
                (hideProfileOnDesktop ? " d-none" : "")
              }
              onClick={() => setShowOffcanvas(false)}
            >
              {item.label}
            </Nav.Link>
          );
        })}

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
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className={`navbar-dark smooth-navbar ${
          isFixed || location.pathname !== "/" ? "navbar-bg" : "bg-transparent"
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

          <Navbar.Collapse className="justify-content-end d-none d-lg-flex align-items-center">
            {renderNavLinks()}

            {isAuthenticated && user && (
              <div
                className="d-flex align-items-center text-white ms-3 position-relative"
                ref={userMenuRef}
              >
                <button
                  onClick={toggleUserMenu}
                  className="btn btn-link d-flex align-items-center text-white p-0"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="fw-semibold me-2"
                    style={{ userSelect: "none" }}
                  >
                    {user.title} {user.name || "User"}
                  </span>
                  <FaRegCircleUser size={28} className="text-warning" />
                </button>

                {showUserMenu && (
                  <div
                    className="position-absolute bg-dark shadow-lg rounded p-2 ms-3"
                    style={{
                      left: 0,
                      marginTop: "95px",
                      minWidth: "150px",
                      zIndex: 1000
                    }}
                  >
                    <button
                      className="dropdown-item text-warning fw-semibold ms-2"
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="dropdown-item text-warning fw-semibold ms-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas for Mobile */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        className="text-white"
        style={{ backgroundColor: "#0d1117" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-semibold">
            {COMPANY_NAME}
          </Offcanvas.Title>
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
            <div className="mt-auto px-3 pb-3">
              <Button
                variant="outline-warning"
                className="w-100 fw-semibold"
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
