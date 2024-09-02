import api from "./professionalApi";

export const fetchOnboardingList = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/jobs/onboarding/list`
  );
  return response;
};

export const getOnboardingAppliedJobHistory = async (
  jobId: number,
  jobApplicationId: number
) => {
  const res = await api.get(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/history`,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const getOnboardingAssignmentDetails = async (
  jobId: number,
  jobApplicationId: number,
  jobAssignmentId: number
) => {
  const res = await api.get(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/job-assignment/${jobAssignmentId}`
  );

  return res;
};

export const deleteOnboardingCoreComplianceDocument = async (
  jobId: number,
  jobApplicationId: number,
  documentId: number
) => {
  const res = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/remove-upload/${documentId}`,
    {},
    { withCredentials: true }
  );

  return res;
};

export const applyTalentSuggestedProfessionalDocument = async (
  jobId: number,
  jobApplicationId: number,
  documentId: number,
  professionalDocumentId: number
) => {
  const res = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/use-suggested/${documentId}`,
    { professionalDocumentId },
    { withCredentials: true }
  );

  return res;
};
