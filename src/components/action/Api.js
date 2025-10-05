import axios from "axios";

const VITE_LOCAL_API = "https://localhost:8080/api";

const api = axios.create({
  baseURL: VITE_LOCAL_API,
  headers: {
    "Content-Type": "application/json"
  }
});

let storeToken = null;
let toastFn = null;
let navigateFn = null;

export const setToastHandler = (fn) => {
  toastFn = fn;
};

export const setToken = (token) => {
  storeToken = token;
};

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

const redirectTo = (path) => {
  if (navigateFn) {
    navigateFn(path);
  }
};

// ====== Request Interceptor ======
api.interceptors.request.use(
  (config) => {
    if (!config.skipAuth && storeToken) {
      config.headers.Authorization = `Bearer ${storeToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== Response Interceptor ======
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (typeof toastFn === "function") {
        toastFn({
          severity: "error",
          summary: "Server Error",
          detail: "Server unreachable. Please try again later.",
          life: 3000
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
