import api from "./api";

type getApplicantsType = {
  facilityId: number;
  jobId: number;
  search?: string;
  abortController?: AbortController;
};

export const getApplicants = async ({
  facilityId,
  jobId,
  search,
  abortController,
}: getApplicantsType) => {
  const applicants = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/applicants${
      search ? `?search=${search}` : ""
    }`,
    {
      signal: abortController?.signal,
    }
  );
  return applicants;
};

type getSubmissionsType = {
  facilityId: number;
  jobId: number;
};

export const getSubmissions = async ({
  facilityId,
  jobId,
}: getSubmissionsType) => {
  const Submissions = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/submissions`
  );
  return Submissions;
};

type getProfessionalType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
};

type fetchApplicantProfessionalDocumentsType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  page: number;
  size: number;
};

export const fetchApplicantProfessionalDetails = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/details`
  );
  return professional;
};
export const fetchApplicantProfessionalWorkHistory = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/work-history`
  );
  return professional;
};
export const fetchApplicantProfessionalReferences = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/references`
  );
  return professional;
};
export const fetchApplicantProfessionalEducation = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/education`
  );
  return professional;
};

export const fetchApplicantProfessionalLicenses = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/licenses`
  );
  return professional;
};

export const fetchApplicantProfessionalCertifications = async ({
  facilityId,
  jobId,
  professionalId,
}: getProfessionalType) => {
  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/certifications`
  );
  return professional;
};

export const fetchApplicantProfessionalDocuments = async ({
  facilityId,
  jobId,
  professionalId,
  page,
  size,
}: fetchApplicantProfessionalDocumentsType) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("size", size.toString());

  const professional = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/documents?${params}`
  );
  return professional;
};

type getJobSubmissionDocumentsType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
};

export const getJobSubmissionDocuments = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
}: getJobSubmissionDocumentsType) => {
  const documents = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/documents/submission`
  );
  return documents;
};

export const addNewSubmissionDocument = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  documentmaster,
}: {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  documentmaster: number;
}) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/documents/submission/add-new`,
    {
      documentMasterId: documentmaster,
    }
  );

  return res;
};

type JobSubmissionDocumentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  submissionDocumentId: number;
  document: File;
};

export const uploadSubmissionDocument = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  submissionDocumentId,
  document,
}: JobSubmissionDocumentType) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/documents/upload/${submissionDocumentId}`,
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

export const removeSubmissionDocument = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  submissionDocumentId,
}: {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  submissionDocumentId: number;
}) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/documents/remove-upload/${submissionDocumentId}`
  );
  return res;
};

export const deleteSubmissionDocument = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  submissionDocumentId,
}: {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  submissionDocumentId: number;
}) => {
  const res = api.delete(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/documents/delete/${submissionDocumentId}`
  );
  return res;
};

export type submitSubmissionType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  data: {
    unit: string;
    availableStartDate: string;
    shiftId: number;
    requestingTimeOff?: string[];
    totalYearsOfExperience: number;
    totalYearsOfExperienceInUnit: number;
    isTravelExperience: boolean;
    isTraumaExperience: boolean;
    isTeachingHospitalExperience: boolean;
    isEMRExperience: boolean;
    notes: string | null;
    removeLogo: boolean;
    addSsn: boolean;
    addDob: boolean;
  };
};

export const submitSubmission = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  data,
}: submitSubmissionType) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/submit`,
    data
  );
  return res;
};

type declineApplicationType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicantId: number;
  value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
};

export const declineApplication = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
  value,
}: declineApplicationType) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/decline`,
    {
      status: value,
    }
  );
  return res;
};

export const fetchGetJobSubmission = ({
  facilityId,
  jobId,
  professionalId,
  currentApplicantId,
}: getJobSubmissionDocumentsType) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicantId}/submission`
  );
  return res;
};

export const downloadProfessionalDocument = ({
  facilityId,
  jobId,
  professionalId,
  documentId,
}: {
  facilityId: number;
  jobId: number;
  professionalId: number;
  documentId: number;
}) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/document/download/${documentId}`
  );
  return res;
};
export const downloadProfessionalCertification = ({
  facilityId,
  jobId,
  professionalId,
  certificationId,
}: {
  facilityId: number;
  jobId: number;
  professionalId: number;
  certificationId: number;
}) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/certification/download/${certificationId}`
  );
  return res;
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

export const fetchSuggestedDocuments = async ({
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

type applySuggestedDocumentsType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  documentId: number;
  suggestedDocumentId: number;
};

export const applySuggestedDocuments = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  documentId,
  suggestedDocumentId,
}: applySuggestedDocumentsType) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/use-suggested/${documentId}`,
    {
      professionalDocumentId: suggestedDocumentId,
    }
  );
  return res;
};
