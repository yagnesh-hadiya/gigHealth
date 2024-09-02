import api from "./api";

export const getInterestedJobList = async (
  size: number,
  page: number,
  abortController: AbortController,
  search: string,
  startDate: string,
  endDate: string
) => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/interested/list?size=${size}&page=${page}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
    {
      withCredentials: true,
      signal: abortController.signal,
    }
  );
  return value?.data?.data[0];
};

export const getAppliedJobList = async (
  size: number,
  page: number,
  abortController: AbortController,
  search: string,
  startDate: string,
  endDate: string
) => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/applied/list?size=${size}&page=${page}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
    {
      withCredentials: true,
      signal: abortController.signal,
    }
  );
  return value?.data?.data[0];
};

export const getAppliedJobHistory = async (
  jobId: number,
  jobApplicationId: number
) => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/history`,
    {
      withCredentials: true,
    }
  );
  return value;
};

export const getAssignmentsList = async (
  size: number,
  page: number,
  abortController: AbortController,
  search: string,
  startDate: string,
  endDate: string
) => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/assignment/list?size=${size}&page=${page}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
    {
      withCredentials: true,
      signal: abortController.signal,
    }
  );
  return value?.data?.data[0];
};

export const getJobAssignmentDetails = async (
  jobId: number,
  jobApplicationId: number,
  jobAssignmentId: number
) => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/job-assignment/${jobAssignmentId}`,
    {
      withCredentials: true,
    }
  );
  return value;
};

export const uploadJobComplinceDocuments = async (
  JobId: number,
  JobApplicationId: number,
  Id: number,
  document: File
) => {
  const response = await api.put(
    `/api/v1/talent/protected/jobs/job/${JobId}/job-application/${JobApplicationId}/upload/${Id}`,
    { document: document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response;
};
