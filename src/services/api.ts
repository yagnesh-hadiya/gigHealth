import axios from "axios";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeTokens,
  updateLocalAccessToken,
} from "../helpers/tokens";
import { API_BASE_URL } from "../helpers/config";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config: any) => {
    const token = getLocalAccessToken();

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
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

    if (originalConfig.url !== "/api/v1/auth/login" && err.response) {
      if (
        err.response.status === 401 &&
        err.response?.data?.message === "Invalid token" &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        const refreshToken = getLocalRefreshToken();

        try {
          const res = await instance.post("/api/v1/auth/token", {
            refreshToken,
          });
          const { accessToken } = res.data.data[0];
          updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        } catch (_error) {
          await removeTokens();
          window.location.href = "./login";
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
