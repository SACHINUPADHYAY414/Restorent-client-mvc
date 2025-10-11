import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import About from "./pages/about/About";
import Menu from "./pages/menu/Menu";
import Event from "./pages/event/Event";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Gallery from "./pages/gallery/Gallery";
import Testimonial from "./pages/testimonial/Testimonial";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import BookTable from "./pages/bookTable/BookTable";
import { EXPIRATION_TIME, OPPS_MSG, TOKEN_EXPIRE } from "./utills/string";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/slice/authSlice";
import { useToastr } from "./components/toast/Toast";
import Profile from "./pages/profile/Profile";
import Reservation from "./pages/reservation/Reservation";
import MenuItems from "./admin/pages/menuItem/MenuItems";
import AddMenuItem from "./admin/pages/menuItem/AddMenuItem";
import AdminGallery from "./admin/pages/gallery/Gallery";
import ReservationBook from "./admin/pages/reservationBook/ReservationBook";
import DashboardLayout from "./admin/dashboard/Dashboard";
import AddEditGallery from "./admin/pages/gallery/AddGallery";
import DashboardHome from "./admin/pages/home/Home";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const { loginTime, isAuthenticated } = useSelector((state) => state.auth);

  const { customToast } = useToastr();
  useEffect(() => {
    if (isAuthenticated && loginTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timePassed = now - loginTime;

        if (timePassed >= EXPIRATION_TIME) {
          dispatch(logout());
          clearInterval(interval);
          customToast({
            severity: "error",
            summary: OPPS_MSG,
            detail: TOKEN_EXPIRE
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loginTime, isAuthenticated, dispatch]);

  // useEffect(() => {
  //   const style = document.createElement("style");
  //   style.innerHTML = `
  //     body, body * {
  //       -webkit-user-select: none !important;
  //       -moz-user-select: none !important;
  //       -ms-user-select: none !important;
  //       user-select: none !important;
  //       -webkit-touch-callout: none !important;
  //     }
  //   `;
  //   document.head.appendChild(style);

  //   const handleContextMenu = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   const handleKeyDown = (e) => {
  //     if (
  //       (e.ctrlKey || e.metaKey) &&
  //       ["c", "x", "s", "p"].includes(e.key.toLowerCase())
  //     ) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.head.removeChild(style);
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="events" element={<Event />} />
          <Route path="testimonial" element={<Testimonial />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="book" element={<BookTable />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <PrivateRoute>
                <Reservation />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          
          <Route path="home" element={<DashboardHome />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="add-menu" element={<AddMenuItem />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="reservations" element={<ReservationBook />} />
          <Route path="add-gallery" element={<AddEditGallery />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
