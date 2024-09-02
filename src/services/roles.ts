import api from "./api";
import { Allow } from "../types/RoleTypes";

export const getRolesList = async (
  search: string,
  abortController: AbortController
) => {
  const roles = await api.get(
    `/api/v1/protected/modules/roles/list?search=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return roles.data.data;
};

export const getRolesDetails = async (roleId: number) => {
  const roles = await api.get(`/api/v1/protected/modules/roles/role/${roleId}`);
  return roles.data.data[0];
};

export const getModules = async () => {
  const modules = await api.get("/api/v1/protected/modules/roles/modules");
  return modules.data.data;
};

export const createRole = async (
  title: string,
  description: string,
  allows: Allow[]
) => {
  const res = await api.post(`/api/v1/protected/modules/roles/create`, {
    title: title,
    description: description,
    allows: allows,
  });
  return res;
};

export const deleteRole = async (roleId: number) => {
  const deletedReole = await api.delete(
    `/api/v1/protected/modules/roles/delete/${roleId}`
  );
  return deletedReole;
};

export const editRole = async (
  title: string,
  description: string,
  allows: Allow[],
  roleId: number
) => {
  const res = await api.put(`/api/v1/protected/modules/roles/edit/${roleId}`, {
    title: title,
    description: description,
    allows: allows,
  });
  return res;
};
