import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { FaArrowUp } from "react-icons/fa";
import Loader from "../loader/Loader";

const Layout = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(56);

  useEffect(() => {
    window.loadingStart = () => setIsLoading(true);
    window.loadingEnd = () => setIsLoading(false);

    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    return () => {
      delete window.loadingStart;
      delete window.loadingEnd;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header ref={headerRef} />

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: `${headerHeight}px`,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1020
          }}
        >
          <Loader />
        </div>
      )}

      <div className={isHomePage ? "" : "main-content"}>
        <Outlet />
      </div>

      <Footer />

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            cursor: "pointer"
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Layout;
