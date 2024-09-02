import { deleteAclPermissions, setAclPermissions } from "../helpers";
import {
  removeActiveMenu,
  removeTokens,
  updateLocalAccessToken,
  updateLocalRefreshToken,
} from "../helpers/tokens";
import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  const { accessToken, refreshToken, allows } = response.data.data[0];
  updateLocalAccessToken(accessToken);
  updateLocalRefreshToken(refreshToken);
  setAclPermissions(allows);
};

export const forgotPassword = async (email: string) => {
  await api.post(`/api/v1/auth/forgot-password`, {
    email,
  });
};

export const logOut = async () => {
  await api.post("/api/v1/protected/auth/logout");
  removeTokens();
  deleteAclPermissions();
  removeActiveMenu();
};

export const changePassword = async (password: string, newPassword: string) => {
  await api.put(`/api/v1/protected/auth/change-password`, {
    password,
    newPassword,
  });
};
export const resetPassword = async (emailToken: string, password: string) => {
  await api.post(`/api/v1/auth/reset-password`, {
    emailToken,
    password,
  });
};
export const setPassword = async (emailToken: string, password: string) => {
  await api.post(`/api/v1/auth/set-password`, {
    emailToken,
    password,
  });
};

export const fetchProfile = async () => {
  const result = await api.get("/api/v1/protected/user/profile");
  return result.data.data[0];
};
