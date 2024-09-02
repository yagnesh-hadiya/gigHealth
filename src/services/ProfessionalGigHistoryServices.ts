import api from "./api";

type getProfessionalGigHistory = {
  professionalId: number;
  search?: string;
  size?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  abortController?: AbortController;
};
type getProfessionalAppliedJobs = {
  professionalId: number;
  search?: string;
  size?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  abortController?: AbortController;
};

type DownloadAllDocuments = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  abortController?: AbortController;
};

type DownloadDocument = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  documentId: number;
};

type GetJobAssignmentType = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

type updateJobInterestType = {
  professionalId: number;
  facilityId: number;
  jobId: number;
  status: boolean;
};

class ProfessionalGigHistoryServices {
  async getProfessionalGigHistory({
    professionalId,
    search,
    size,
    page,
    startDate,
    endDate,
    abortController,
  }: getProfessionalGigHistory) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/assignment-history${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  }

  async getProfessionalAppliedJobs({
    professionalId,
    search,
    size,
    page,
    startDate,
    endDate,
    abortController,
  }: getProfessionalAppliedJobs) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/applied-jobs${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  }

  async getProfessionalJobInterests({
    professionalId,
    search,
    size,
    page,
    abortController,
  }: getProfessionalAppliedJobs) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/job-interests${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  }

  async downloadAllDocuments({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
  }: DownloadAllDocuments) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/download`,
      {
        responseType: "blob",
      }
    );
    return res;
  }

  async fetchApplicationHistory({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
  }: DownloadAllDocuments) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/history`
    );
    return res;
  }

  async updateJobInterest({
    professionalId,
    facilityId,
    jobId,
    status,
  }: updateJobInterestType) {
    const res = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/interest`,
      {
        interested: status,
      }
    );
    return res;
  }

  async getSubmissionDocuments({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
  }: DownloadAllDocuments) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/submission`
    );
    return res;
  }

  async getOnboradingDocuments({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
    abortController,
  }: DownloadAllDocuments) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/on-boarding`,
      {
        signal: abortController?.signal,
      }
    );
    return res;
  }

  async getRequiredToApplyDocuments({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
  }: DownloadAllDocuments) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/application`
    );
    return res;
  }

  async getJobAssignment({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
    jobAssignmentId,
  }: GetJobAssignmentType) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return res;
  }

  async downloadDocument({
    professionalId,
    facilityId,
    jobId,
    jobApplicationId,
    documentId,
  }: DownloadDocument) {
    const res = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/gighistory/facility/${facilityId}/job/${jobId}/job-applications/${jobApplicationId}/documents/download/${documentId}`,
      {
        responseType: "blob",
      }
    );
    return res;
  }
}

export default new ProfessionalGigHistoryServices();
