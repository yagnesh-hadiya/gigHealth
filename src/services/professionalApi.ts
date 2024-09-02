import axios from "axios";
import { API_BASE_URL } from "../helpers/config";
import { clearCookies, getCookies } from "./ProfessionalAuth";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config: any) => {
    const csrfToken = getCookies("CSRF_TOKEN");

    if (csrfToken) {
      config.headers["x-gig-csrf"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/api/v1/talent/auth/login" && err.response) {
      if (
        (err.response.status === 401 &&
          err.response?.data?.message === "Invalid token") ||
        (err.response?.data?.message === "Missing CSRF Token" &&
          err.response.status === 401) ||
        (err.response?.data?.message === "Missing Session Token" &&
          err.response.status === 401) ||
        (err.response?.data?.message === "Invalid token" &&
          err.response.status === 401) ||
        (err.response?.data?.message === "Invalid CSRF token" &&
          err.response.status === 403) ||
        (err.response?.data?.message === "Invalid claim in token" &&
          err.response.status === 403) ||
        (err.response?.data?.message === "Invalid user" &&
          err.response.status === 403) ||
        (err.response?.data?.message === "Invalid identifier" &&
          err.response.status === 401) ||
        (err.response?.data?.message === "Professional is disabled" &&
          err.response.status === 403)
      ) {
        localStorage.removeItem("isLoggedIn");
        clearCookies();
        window.location.href = "/talent/login";

        return Promise.reject("");
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
