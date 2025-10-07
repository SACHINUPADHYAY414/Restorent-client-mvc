import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "swiper/css";
import "swiper/css/pagination";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastrProvider } from "./components/toast/Toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "animate.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastrProvider>
        <App />
      </ToastrProvider>
    </Provider>
  </React.StrictMode>
);
