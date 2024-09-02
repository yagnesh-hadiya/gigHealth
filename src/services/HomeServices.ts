import api from "./api";

export const getSuggestedJobsList = async (size: number, page: number) => {
  let jobsList;
  jobsList = await api.get(
    `/api/v1/talent/protected/jobs/suggested/list?size=${size}&page=${page}`,
    {
      withCredentials: true,
    }
  );
  return jobsList?.data?.data[0];
};

export const acceptJob = async (
  jobId: number,
  jobApplicationId: number,
  id: number
) => {
  const value = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/job-assignment/${id}/accept`,
    {},
    {
      withCredentials: true,
    }
  );
  return value;
};

export const declineJob = async (
  jobId: number,
  jobApplicationId: number,
  id: number
) => {
  const value = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/job-assignment/${id}/decline`,
    {},
    {
      withCredentials: true,
    }
  );
  return value;
};

export const getProfessionalOffered = async () => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/pending-requests`,
    {
      withCredentials: true,
    }
  );
  return value;
};

export const getAssignmentList = async () => {
  const value = await api.get(
    `/api/v1/talent/protected/jobs/upcoming-assignment/list`,
    {
      withCredentials: true,
    }
  );
  return value;
};
