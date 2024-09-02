import { OfferFormType } from "../types/ApplicantTypes";
import api from "./api";

type TerminateAssignment = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: {
    status:
      | "Facility Termination"
      | "Professional Termination"
      | "Gig Termination";
    notes: string;
  };
};

type EditAssignmentTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: OfferFormType;
};

type GetJobAssignment = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

type GetOnboardingDocuments = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
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

type DownloadAllDocuments = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentIds: number[];
};

type RemoveDocument = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
};

type AddNewDocument = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentMasterId: number;
};

type FetchSuggestedDocuments = {
  jobId: number;
  facilityId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  size: number;
  page: number;
};

type applySuggestedDocumentsType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  suggestedDocumentId: number;
};

type JobAssignmentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

export type TerminateOnboardingType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
};

export type onboardingExtensionPlacementType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};
class ProfessionalOnboardingServices {
  getProfessionalOnboarding = async (id: number) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${id}/onboarding/jobs`
    );
    return response;
  };

  terminateAssignment = async ({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
    jobAssignmentId,
    data,
  }: TerminateAssignment) => {
    const response = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/terminate`,
      data
    );
    return response;
  };

  getJobAssignment = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: GetJobAssignment) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return response;
  };

  getOnboardingDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: GetOnboardingDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/on-boarding`
    );
    return response;
  };

  getSubmissionDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: GetOnboardingDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/submission`
    );
    return response;
  };

  getRequiredToApplyDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: GetOnboardingDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/application`
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
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/upload/${documentId}`,
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
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/verify/${documentId}`,
      data
    );
    return response;
  };

  downloadAllDocuments = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentIds,
  }: DownloadAllDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/download${`?ids=${documentIds.join(
        ","
      )}`}
      `,
      {
        responseType: "blob",
      }
    );
    return response;
  };

  removeDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
  }: RemoveDocument) => {
    const response = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/remove-upload/${documentId}`
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
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/delete/${documentId}`
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
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/on-boarding/add-new`,
      {
        documentMasterId: documentMasterId,
      }
    );
    return res;
  };

  addNewSubmissionDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentMasterId,
  }: AddNewDocument) => {
    const res = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/submission/add-new`,
      {
        documentMasterId: documentMasterId,
      }
    );
    return res;
  };

  downloadDocument = async ({
    jobId,
    facilityId,
    professionalId,
    jobApplicationId,
    documentId,
  }: RemoveDocument) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/download/${documentId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  };

  fetchDocumentStatus = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: GetOnboardingDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/status`
    );
    return response;
  };

  fetchHistory = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: GetOnboardingDocuments) => {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/history`
    );
    return response;
  };

  fetchSuggestedDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    documentId,
    size,
    page,
  }: FetchSuggestedDocuments) => {
    const response = await api.get(
      `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/suggestion/${documentId}?size=${size}&page=${page}`
    );
    return response?.data?.data[0];
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
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/use-suggested/${documentId}`,
      {
        professionalDocumentId: suggestedDocumentId,
      }
    );
    return res;
  };

  editAssignment = ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    data,
  }: EditAssignmentTypes) => {
    const res = api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/edit`,
      data
    );
    return res;
  };

  placement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const placement = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/placement`
    );
    return placement;
  };

  terminateOnboarding = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    value,
  }: TerminateOnboardingType) => {
    const res = api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/decline`,
      { status: value }
    );
    return res;
  };

  onboardingExtensionPlacement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: onboardingExtensionPlacementType) => {
    const res = api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/placement`
    );
    return res;
  };

  onboardingExtensionRequest = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: onboardingExtensionPlacementType) => {
    const res = api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/onboarding/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/approve`
    );
    return res;
  };
}

export default new ProfessionalOnboardingServices();
