import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import About from "./pages/about/About";
import Menu from "./pages/menu/Menu";
import Event from "./pages/event/Event";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
// import Login from "./pages/login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="events" element={<Event />} />
          <Route path="*" element={<PageNotFound />} />-
        </Route>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        />

        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};
export default App;
