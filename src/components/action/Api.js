import axios from 'axios';
import { store } from '../../store/store';
const VITE_LOCAL_API = "http://localhost:8082/api";

const api = axios.create({
  baseURL: VITE_LOCAL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (!config.skipAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let toastFn = null;
let navigateFn = null;

const redirectTo = (path) => {
  if (navigateFn) {
    navigateFn(path);
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (typeof toastFn === "function") {
        toastFn({
          severity: "error",
          summary: "Server Error",
          detail: "Server unreachable. Please try again later.",
          life: 3000,
        });
      }
      redirectTo("/server-error");
    }

    if (error.response && error.response.status >= 500) {
      redirectTo("/server-error");
    }

    return Promise.reject(error);
  }
);

export default api;
