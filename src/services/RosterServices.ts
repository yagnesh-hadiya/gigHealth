import { OfferFormType } from "../types/ApplicantTypes";
import api from "./api";

type getRosterType = {
  facilityId: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  abortController?: AbortController;
};

type EditAssignmentTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: OfferFormType;
};

type JobAssignmentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
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

type payDetails = {
  regularRate: number;
  overTimeRate: number;
  doubleTimeRate: number;
  holidayRate: number;
  chargeRate: number;
  onCallRate: number;
  callBackRate: number;
  travelReimbursement: number;
  mealsAndIncidentals: number;
  housingStipend: number;
};

type BillingDetails = {
  billRate: number;
  overTimeBillRate: number;
  doubleTimeBillRate: number;
  holidayBillRate: number;
  chargeBillRate: number;
  onCallBillRate: number;
  callBackBillRate: number;
};

export type OfferExtensionData = {
  startDate: string;
  endDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  specialityId: number;
  professionId: number;
  unit: string;
  shiftId: number;
  approvedTimeOff?: string[];
  regularHrs: number;
  overtimeHrs: number;
  totalHrsWeekly: number;
  totalDaysOnAssignment: number;
  gauranteedHours: number;
  complianceDueDate: string;
  notes: string;
  costCenter: string;
  reqId: string;
  payDetails: payDetails;
  billingDetails: BillingDetails;
};

type OfferExtensionType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: OfferExtensionData;
};

export type RequestExtensionType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
  data: {
    startDate: string;
    endDate: string;
    shiftStartTime: string;
    shiftEndTime: string;
    specialityId: number;
    professionId: number;
    unit: string;
    shiftId: number;
    approvedTimeOff?: string[];
    regularHrs: number;
    overtimeHrs: number;
    totalHrsWeekly: number;
    totalDaysOnAssignment: number;
    gauranteedHours: number;
    complianceDueDate: string;
    notes: string;
    costCenter: string;
    payDetails: payDetails;
    billingDetails: BillingDetails;
    emailSubmission: {
      toEmails: string[];
      ccEmails?: string[];
      bccEmails?: string[];
      subject: string;
      body: string;
    };
  };
};

export type TerminateType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
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

type declineApplicationType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  currentApplicationId: number;
  jobAssignmentId: number;
  value:
    | "Declined by Gig"
    | "Declined by Facility"
    | "Declined by Professional";
};

class RosterServices {
  public async getRoster({
    facilityId,
    search,
    startDate,
    endDate,
    abortController,
  }: getRosterType) {
    const queryParams = new URLSearchParams();

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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/list${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
    );
    return response;
  };

  fetchProfessionalDetails = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/details`
    );
    return professional;
  };

  fetchProfessionalWorkHistory = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/work-history`
    );
    return professional;
  };

  fetchProfessionalReferences = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/references`
    );
    return professional;
  };

  fetchProfessionalEducation = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/education`
    );
    return professional;
  };

  fetchProfessionalLicenses = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/licenses`
    );
    return professional;
  };

  fetchProfessionalCertifications = async ({
    facilityId,
    jobId,
    professionalId,
  }: getProfessionalType) => {
    const professional = await api.get(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/certifications`
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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/documents?${params}`
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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/document/download/${docId}`
    );
    return professional;
  };

  offerExtension = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    data,
  }: OfferExtensionType) => {
    const professional = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/offer`,
      data
    );
    return professional;
  };

  terminateJobAssignment = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    data,
  }: TerminateType) => {
    const res = api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/terminate`,
      data
    );
    return res;
  };

  declineApplication = ({
    facilityId,
    jobId,
    professionalId,
    currentApplicationId,
    jobAssignmentId,
    value,
  }: declineApplicationType) => {
    const res = api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${currentApplicationId}/job-assignment/${jobAssignmentId}/decline`,

      {
        status: value,
      }
    );
    return res;
  };

  getJobDetails = async ({
    facilityId,
    jobId,
  }: {
    facilityId: number;
    jobId: number;
  }) => {
    const details = await api.get(
      `/api/v1/protected/modules/jobs/facility/${facilityId}/details/${jobId}`
    );
    return details;
  };

  requestExtension = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
    data,
  }: RequestExtensionType) => {
    const professional = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/request`,
      data
    );
    return professional;
  };

  extensionPlacement = async ({
    facilityId,
    jobId,
    professionalId,
    jobApplicationId,
    jobAssignmentId,
  }: JobAssignmentType) => {
    const placement = await api.put(
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/placement`
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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/approve`
    );
    return extension;
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
      `/api/v1/protected/submodules/facilities/${facilityId}/roster/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/edit`,
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
      `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/placement`
    );
    return placement;
  };
}

export default new RosterServices();
