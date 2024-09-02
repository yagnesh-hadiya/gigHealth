import { ApplyTalentProfessionalType } from "../types/TalentJobs";
import api from "./professionalApi";

export const getProfessionalJobDetails = async (jobId: number) => {
  const response = await api.get(`/api/v1/talent/protected/jobs/job/${jobId}`);
  return response;
};

export const getProfessionalRequiredDocs = async (jobId: number) => {
  const response = await api.get(
    `/api/v1/talent/protected/jobs/job/${jobId}/documents/required-to-apply`
  );
  return response;
};

export const markInterestedJob = async (jobId: number, interested: boolean) => {
  await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/interested`,
    {
      interested,
    },
    { withCredentials: true }
  );
};

export const uploadRequiredDoc = async (document: File, docId: number) => {
  const status = await api.post(
    `/api/v1/talent/protected/user/documents/core-compliance/upload/${docId}`,
    { document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return status;
};

export const jobWithdraw = async (jobId: number, appId: number) => {
  const status = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${appId}/withdraw`
  );
  return status;
};

export const applyTalentProfessional = async (
  jobId: number,
  data: ApplyTalentProfessionalType
) => {
  const job = await api.post(
    `/api/v1/talent/protected/jobs/job/${jobId}/apply`,
    data,
    { withCredentials: true }
  );
  return job;
};

export const getSuggestedDocs = async (
  docId: number,
  size: number,
  page: number
) => {
  const docs = await api.get(
    `/api/v1/talent/protected/jobs/document-suggestion/${docId}?size=${size}&page=${page}`
  );
  return docs.data?.data[0];
};

export const applySuggestedProfessionalDocument = async (
  docId: number,
  professionalDocumentId: number
) => {
  const response = await api.put(
    `/api/v1/talent/protected/jobs/use-suggested/${docId}`,
    { professionalDocumentId },
    { withCredentials: true }
  );
  return response;
};

export const downloadSuggestedProfessionalDocument = async (docId: number) => {
  const response = await api.get(
    `/api/v1/talent/protected/user/documents/professional-document/download/${docId}`,
    { withCredentials: true, responseType: "blob" }
  );
  return response;
};
