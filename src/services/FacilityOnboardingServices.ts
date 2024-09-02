import api from "./api";

type getProfessionalType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
};

type downloadType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  docId: number;
};

type fetchProfessionalDocumentStatusType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
};

type JobAssignmentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

type UploadOnboardingDocuments = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  document: File;
};

type VerifyJobComplianceDocument = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  data: {
    approved?: boolean;
    rejectionNotes?: string;
    effectiveApprovalDate?: string;
    expiryDays?: number;
  };
};

type AddNewDocument = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentMasterId: number;
};

type RemoveDocument = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
};

type getFacilityOnboardingType = {
  id: number;
  search?: string;
  abortController?: AbortController;
};

type applySuggestedDocumentsType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  suggestedDocumentId: number;
};

class FacilityOnboardingServices {
  getFacilityOnboarding = async ({
    id,
    search,
    abortController,
  }: getFacilityOnboardingType) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${id}/onboarding/list${
        search ? `?search=${search}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  };

  fetchProfessionalDetails = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/details`
    );
    return professional;
  };
  fetchProfessionalWorkHistory = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/work-history`
    );
    return professional;
  };
  fetchProfessionalReferences = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/references`
    );
    return professional;
  };
  fetchProfessionalEducation = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/education`
    );
    return professional;
  };
  fetchProfessionalLicenses = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/licenses`
    );
    return professional;
  };
  fetchProfessionalCertifications = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/certifications`
    );
    return professional;
  };
  fetchProfessionalDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    page,
    size,
  }: {
    facilityId: number;
    jobId: number;
    professionalId: number;
    page: number;
    size: number;
  }) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", size.toString());
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/documents?${params}`
    );
    return professional;
  };
  downloadProfessionalDocument = async ({
    facilityId,
    jobId,
    professionalId,
    docId,
  }: downloadType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/document/download/${docId}`
    );
    return professional;
  };

  fetchProfessionalDocumentStatus = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: fetchProfessionalDocumentStatusType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/status`
    );
    return professional;
  };

  fetchJobAssignment = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return response;
  };

  fetchOnboardingDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: fetchProfessionalDocumentStatusType) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/on-boarding`
    );
    return response;
  };

  uploadOnboardingDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
    document,
  }: UploadOnboardingDocuments) => {
    const res = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/upload/${documentId}`,
      {
        document: document,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  };

  verifyJobComplianceDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
    data,
  }: VerifyJobComplianceDocument) => {
    const response = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/verify/${documentId}`,
      data
    );
    return response;
  };

  addNewDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentMasterId,
  }: AddNewDocument) => {
    const res = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/on-boarding/add-new`,
      {
        documentMasterId: documentMasterId,
      }
    );
    return res;
  };

  removeDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
  }: RemoveDocument) => {
    const response = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/remove-upload/${documentId}`
    );
    return response;
  };

  deleteDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
  }: RemoveDocument) => {
    const response = await api.delete(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/delete/${documentId}`
    );
    return response;
  };

  downloadDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
  }: RemoveDocument) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/download/${documentId}`,

      {
        responseType: "blob",
      }
    );
    return response;
  };

  getFacilityOnboardingPdf = async (facilityId: number) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/pdf`
    );
    return response;
  };

  applySuggestedDocuments = ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    documentId,
    suggestedDocumentId,
  }: applySuggestedDocumentsType) => {
    const res = api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/onboarding/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/use-suggested/${documentId}`,
      {
        professionalDocumentId: suggestedDocumentId,
      }
    );
    return res;
  };
}
export default new FacilityOnboardingServices();
