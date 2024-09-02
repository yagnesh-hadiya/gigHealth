import { OfferFormType } from "../types/ApplicantTypes";
import api from "./api";

type getFacilityGigHistoryType = {
  facilityId: number;
  size: number;
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  abortController?: AbortController;
};

type fetchSubmissionPdfTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
};

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

type GetJobAssignmentType = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

type declineAssignmentType = {
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

type declineApplicationType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
};

type JobAssignmentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

type EditAssignmentTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: OfferFormType;
};

class FacilityGigHistoryServices {
  public async getFacilityGigHistory({
    facilityId,
    size,
    page,
    search,
    startDate,
    endDate,
    abortController,
  }: getFacilityGigHistoryType) {
    const queryParams = new URLSearchParams();

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (search) {
      queryParams.append("search", search);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/list${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  }

  fetchProfessionalDetails = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/details`
    );
    return professional;
  };
  fetchProfessionalWorkHistory = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/work-history`
    );
    return professional;
  };
  fetchProfessionalReferences = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/references`
    );
    return professional;
  };
  fetchProfessionalEducation = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/education`
    );
    return professional;
  };
  fetchProfessionalLicenses = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/licenses`
    );
    return professional;
  };
  fetchProfessionalCertifications = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/certifications`
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
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/documents?${params}`
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
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/document/download/${docId}`
    );
    return professional;
  };

  fetchSubmissionDocuments = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: fetchProfessionalDocumentStatusType) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/submission`
    );
    return response;
  };

  async getJobAssignment({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
    jobAssignmentId,
  }: GetJobAssignmentType) {
    const res = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return res;
  }

  async fetchJobSubmission({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: fetchProfessionalDocumentStatusType) {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/submission`
    );
    return response;
  }

  fetchJobAssignment = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const response = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return response;
  };

  declineAssignment = ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    value,
  }: declineAssignmentType) => {
    const res = api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/decline`,

      {
        status: value,
      }
    );
    return res;
  };

  declineApplication = ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    value,
  }: declineApplicationType) => {
    const res = api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/decline`,

      {
        status: value,
      }
    );
    return res;
  };

  extensionPlacement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const placement = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/placement`
    );
    return placement;
  };

  approveExtension = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const extension = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/approve`
    );
    return extension;
  };

  placeJobAssignment = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const res = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/placement`
    );
    return res;
  };

  fetchSubmissionPdf = ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
  }: fetchSubmissionPdfTypes) => {
    const res = api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/submission/pdf`,
      {
        responseType: "blob",
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
      `/api/v1/protected/submodules/facilities/${facilityId}/gighistory/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/edit`,
      data
    );
    return res;
  };
}

export default new FacilityGigHistoryServices();
