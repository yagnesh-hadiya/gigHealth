import { getLoggedInStatus } from "./ProfessionalAuth";
import api from "./api";

export const getJobsList = async (
  size: number,
  page: number,
  abortController: AbortController,
  sortByFilter: string,
  sortDir: string,
  search: string,
  specialityIds: string,
  shiftId: string,
  stateIds: string
) => {
  let jobsList;
  if (getLoggedInStatus()) {
    jobsList = await api.get(
      `/api/v1/talent/protected/jobs/list?size=${size}&page=${page}&sortKey=${sortByFilter}&sortDir=${sortDir}&search=${search}&specialityIds=${specialityIds}&shiftId=${shiftId}&stateIds=${stateIds}`,
      {
        withCredentials: true,
        signal: abortController.signal,
      }
    );
  } else {
    jobsList = await api.get(
      `/api/v1/talent/jobs/list?size=${size}&page=${page}&sortKey=${sortByFilter}&sortDir=${sortDir}&search=${search}&specialityIds=${specialityIds}&shiftId=${shiftId}&stateIds=${stateIds}`,
      {
        signal: abortController.signal,
      }
    );
  }
  return jobsList?.data?.data[0];
};

export const getSearchJobShifts = async () => {
  const value = await api.get(`/api/v1/talent/master/job-shifts`);
  return value;
};

export const getStatesLocations = async () => {
  const value = await api.get(`/api/v1/talent/master/states`);
  return value;
};

export const getStateSpecialities = async (Id: number) => {
  const value = await api.get(`/api/v1/talent/master/specialities/${Id}`);
  return value;
};

export const getProfessionCategories = async () => {
  const value = await api.get(`/api/v1/talent/master/profession-categories`);
  return value;
};

export const getProfessions = async (Id: number) => {
  const value = await api.get(`/api/v1/talent/master/professions/${Id}`);
  return value;
};

export const getMarkJobInterest = async (JobId: number, interested: boolean) => {
  const value = await api.put(
    `/api/v1/talent/protected/jobs/job/${JobId}/interested`,
    { interested },
    {
      withCredentials: true,
    }
  );
  return value;
};
