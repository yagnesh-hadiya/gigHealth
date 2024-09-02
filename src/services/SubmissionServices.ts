import { OfferFormType } from "../types/ApplicantTypes";
import api from "./api";

type getSubmissionTypes = {
  facilityId: number;
  jobId: number;
  search?: string;
  abortController?: AbortController;
};

export const fetchSubmissions = ({
  facilityId,
  jobId,
  search,
  abortController,
}: getSubmissionTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/submissions${
      search ? `?search=${search}` : ""
    }
    `,
    {
      signal: abortController?.signal,
    }
  );
  return res;
};

export const fetchSlots = ({
  facilityId,
  jobId,
  search,
  abortController,
}: getSubmissionTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/job-slots${
      search ? `?search=${search}` : ""
    }`,
    { signal: abortController?.signal }
  );
  return res;
};

type makeOfferTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  offerId: number;
  data: OfferFormType;
};

export const makeOffer = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  offerId,
  data,
}: makeOfferTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/offer/${offerId}`,
    data
  );
  return res;
};

type EditAssignmentTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: OfferFormType;
};

export const editAssignment = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  data,
}: EditAssignmentTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/edit`,
    data
  );
  return res;
};

type fetchSubmissionPdfTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
};

export const fetchSubmissionPdf = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
}: fetchSubmissionPdfTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/submission/pdf`,
    {
      responseType: "blob",
    }
  );
  return res;
};

type emailSubmissionTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  data: {
    toEmails: string[];
    ccEmails?: string[];
    bccEmails?: string[];
    subject: string;
    body: string;
  };
};

export const emailSubmission = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  data,
}: emailSubmissionTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/email-submission`,
    data
  );
  return res;
};

export const jobSubmissionHistory = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
}: fetchSubmissionPdfTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/history`
  );
  return res;
};

export const downloadSubmissionDocument = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  documentId,
}: fetchSubmissionPdfTypes & { documentId: number }) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/download/${documentId}`,

    {
      responseType: "blob",
    }
  );
  return res;
};

type fetchRejectedSubmissionsTypes = {
  facilityId: number;
  jobId: number;
  search?: string;
  size?: number;
  page?: number;
  abortController?: AbortController;
};

export const fetchRejectedSubmissions = async ({
  facilityId,
  jobId,
  search,
  size,
  page,
  abortController,
}: fetchRejectedSubmissionsTypes) => {
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
  const res = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/rejected-submissions${
      query ? `?${query}` : ""
    }`,
    {
      signal: abortController?.signal,
    }
  );
  return res;
};
