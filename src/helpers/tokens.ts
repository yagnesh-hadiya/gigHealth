export const updateLocalAccessToken = async (accessToken: string) => {
  localStorage.setItem("access-token", accessToken);
};

export const updateLocalRefreshToken = async (refreshToken: string) => {
  localStorage.setItem("refresh-token", refreshToken);
};

export const removeTokens = async () => {
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("hideSidbebar");
};

export const getLocalAccessToken = () => {
  const token = localStorage.getItem("access-token");
  return token;
};

export const getLocalRefreshToken = () => {
  const token = localStorage.getItem("refresh-token");
  return token;
};

export const storeActiveMenu = (item: string) => {
  return sessionStorage.setItem("menu", item);
};

export const getActiveMenu = () => {
  return sessionStorage.getItem("menu");
};

export const removeActiveMenu = () => {
  return sessionStorage.clear();
};
