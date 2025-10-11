import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { Button, Offcanvas } from "react-bootstrap";
import {
  FaUserCircle,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUtensils,
  FaImages,
  FaCalendarAlt
} from "react-icons/fa";
import {
  COMPANY_NAME,
  LOGOUT_SUCCESS,
  SUCCESS,
  SUCCESS_MSG
} from "../../utills/string";
import { useDispatch, useSelector } from "react-redux";
import { useToastr } from "../../components/toast/Toast";
import { logout } from "../../store/slice/authSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { customToast } = useToastr();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.loadingStart = () => setIsLoading(true);
    window.loadingEnd = () => setIsLoading(false);
    return () => {
      delete window.loadingStart;
      delete window.loadingEnd;
    };
  }, []);

  const sidebarLinks = [
    {
      path: "/dashboard/menu-items",
      label: "Menu Items",
      icon: <FaUtensils />
    },
    { path: "/dashboard/gallery", label: "Gallery", icon: <FaImages /> },
    {
      path: "/dashboard/reservations",
      label: "Reservations",
      icon: <FaCalendarAlt />
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    customToast({
      severity: SUCCESS,
      summary: SUCCESS_MSG,
      detail: LOGOUT_SUCCESS,
      life: 4000
    });
  };

  const sidebarWidth = collapsed ? 80 : 250;

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 bg-dark text-white justify-content-between text-center align-items-center py-3 px-2">
      <div>
        <h5 className="text-start mb-4" style={{ whiteSpace: "nowrap" }}>
          {collapsed ? "AP" : "Admin"}
        </h5>
        <ul className="nav flex-column">
          {sidebarLinks.map(({ path, label, icon }) => (
            <li key={path} className="nav-item">
              <NavLink
                to={path}
                title={collapsed ? label : ""}
                className={({ isActive }) =>
                  `nav-link p-1 d-flex align-items-center text-white${
                    isActive ? "fw-bold text-warning" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
                style={{
                  whiteSpace: "nowrap",
                  paddingLeft: collapsed ? "0" : "0.75rem",
                  paddingRight: collapsed ? "0" : "0.75rem",
                  justifyContent: collapsed ? "center" : "start"
                }}
              >
                <span
                  className="fs-6 mb-1"
                  style={{ marginRight: collapsed ? 0 : "0.5rem" }}
                >
                  {icon}
                </span>
                {!collapsed && label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center d-none d-md-block">
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="d-none d-md-block"
        style={{
          width: sidebarWidth,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          transition: "width 0.3s ease",
          zIndex: 1030
        }}
      >
        <SidebarContent />
      </div>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="bg-dark text-white"
        placement="start"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
      <div
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: "margin-left 0.3s ease, width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8f9fa",
          overflowY: "auto",
          height: "100vh"
        }}
      >
        <header
          className="bg-light border-bottom d-flex justify-content-between align-items-center px-3"
          style={{
            height: "60px",
            position: "sticky",
            top: 0,
            zIndex: 1040,
            width: "100%",
            boxSizing: "border-box",
            flexShrink: 0
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <Button
              className="d-md-none"
              variant="outline-dark"
              size="sm"
              onClick={() => setShowSidebar(true)}
            >
              <FaBars />
            </Button>
            <h5 className="m-0 fw-bold">{COMPANY_NAME}</h5>
          </div>

          <div className="d-flex align-items-center gap-2">
            <strong>
              {user?.title} {user?.name || "User"}
            </strong>
            <div className="dropdown">
              <span
                className="dropdown-toggle d-flex align-items-center"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <FaUserCircle className="fs-4" />
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 px-3" style={{ position: "relative" }}>
          <div style={{ position: "relative", minHeight: "100%" }}>
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10
                }}
              >
                <Loader />
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
