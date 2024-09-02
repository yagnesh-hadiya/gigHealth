import Cookies from "universal-cookie";
import api from "./professionalApi";

export const registerProfessional = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  stateId: number,
  cityId: number,
  zipCodeId: number,
  professionId: number,
  primarySpecialityId: number,
  experience: number,
  preferredLocationIds: number[],
  password: string
) => {
  const register = api.post(`/api/v1/talent/auth/register`, {
    firstName,
    lastName,
    email,
    phone,
    address,
    stateId,
    cityId,
    zipCodeId,
    professionId,
    primarySpecialityId,
    experience,
    preferredLocationIds,
    password,
  });
  return register;
};

export const loginProfessional = async (email: string, password: string) => {
  const response = await api.post(
    `/api/v1/talent/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return response;
};

export const getProfessionalStates = async () => {
  const states = await api.get("/api/v1/talent/master/states");
  return states;
};

export const getProfessionalProfessions = async () => {
  const professions = await api.get(
    `/api/v1/talent/master/profession-categories`
  );
  return professions;
};

export const getProfessionalSpecialities = async (professionId: number) => {
  const specialities = await api.get(
    `/api/v1/talent/master/specialities/${professionId}`
  );
  return specialities;
};

export const getProfessionalCategories = async (professionId: number) => {
  const professions = await api.get(
    `/api/v1/talent/master/professions/${professionId}`
  );
  return professions;
};

export const getProfessionalCities = async (stateId: number) => {
  const cities = await api.get(`/api/v1/talent/master/city/${stateId}`);
  return cities;
};

export const getProfessionalZipCode = async (cityId: number) => {
  const zipCode = await api.get(`/api/v1/talent/master/zip/${cityId}`);
  return zipCode;
};

export const forgotProfessionalPassword = async (email: string) => {
  await api.post(`/api/v1/talent/auth/forgot-password`, {
    email,
  });
};

export const setProfessionalPassword = async (
  emailToken: string,
  password: string
) => {
  return await api.post(`/api/v1/talent/auth/set-password`, {
    emailToken,
    password,
  });
};

export const resetProfesssionalPassword = async (
  emailToken: string,
  password: string
) => {
  return await api.post(`/api/v1/talent/auth/reset-password`, {
    emailToken,
    password,
  });
};

export const professionalLogOut = async () => {
  await api.get("/api/v1/talent/protected/auth/logout", {
    withCredentials: true,
  });
};

export const changeProfessionalPassword = async (
  password: string,
  newPassword: string
) => {
  const response = await api.put(
    `/api/v1/talent/protected/auth/change-password`,
    {
      password,
      newPassword,
    },
    { withCredentials: true }
  );
  return response;
};

export const getCookies = (cookieName: string) => {
  const cookie = new Cookies();
  return cookie.get(cookieName);
};

export const getProfessionalProfile = async () => {
  const response = api.get(`/api/v1/talent/protected/user/profile`, {
    withCredentials: true,
  });
  return response;
};

export const loggedInProfessional = () => {
  return localStorage.setItem("isLoggedIn", "1");
};

export const getLoggedInStatus = () => {
  return localStorage.getItem("isLoggedIn");
};

export const clearCookies = () => {
  const cookies = new Cookies();

  const csrfToken = getCookies("CSRF_TOKEN");

  const sessionToken = getCookies("SESSION_TOKEN");

  const expiryTime = new Date(0);

  if (csrfToken) {
    cookies.set("CSRF_TOKEN", csrfToken, { path: "/", expires: expiryTime });
  }
  if (sessionToken) {
    cookies.set("SESSION_TOKEN", sessionToken, {
      path: "/",
      expires: expiryTime,
    });
  }
};
