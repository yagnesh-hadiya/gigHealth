import api from "./api";

export const getUserRoles = async () => {
  const roles = await api.get(`/api/v1/protected/modules/users/roles`);
  return roles;
};

export const getStates = async () => {
  const states = await api.get("/api/v1/protected/user/states");
  return states;
};

export const getCities = async (stateId: number) => {
  const cities = await api.get(`/api/v1/protected/user/city/${stateId}`);
  return cities;
};

export const addUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  state: string,
  city: string,
  zip: string,
  roleId: number
) => {
  const user = await api.post(`api/v1/protected/modules/users/create`, {
    firstName,
    lastName,
    email,
    phone,
    address,
    state,
    city,
    zip,
    roleId,
  });
  return user;
};

export const getUsersList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string,
  roleId: number | string
) => {
  const users = await api.get(
    `/api/v1/protected/modules/users/list?size=${size}&page=${page}&search=${search}&roleId=${roleId}`,
    {
      signal: abortController.signal,
    }
  );
  return users?.data?.data[0];
};

// export const getUsersList = async (
//   size: number,
//   page: number,
//   search: string,
//   roleId: number | string
// ) => {
//   const users = await api.get(
//     `/api/v1/protected/modules/users/list?size=${size}&page=${page}&search=${search}&roleId=${roleId}`
//   );
//   return users?.data?.data[0];
// };

export const changeUserActivation = async (
  userId: number | undefined,
  value: boolean
) => {
  const toggleActivation = await api.put(
    `/api/v1/protected/modules/users/activation/${userId}`,
    {
      active: value,
    }
  );
  return toggleActivation;
};

export const deleteUser = async (userId: number) => {
  const deletedUser = await api.delete(
    `/api/v1/protected/modules/users/delete/${userId}`
  );
  return deletedUser;
};

export const editUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  state: string,
  city: string,
  zip: string,
  roleId: number,
  userId: number
) => {
  await api.put(`/api/v1/protected/modules/users/edit/${userId}`, {
    firstName,
    lastName,
    email,
    phone,
    address,
    state,
    city,
    zip,
    roleId,
  });
};

export const getZipCode = async (cityId: number) => {
  const zipCode = await api.get(`/api/v1/protected/user/zip/${cityId}`);
  return zipCode;
};
