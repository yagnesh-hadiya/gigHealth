import api from "./api";

type ApplicationDocumentStatusTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
};

export const fetchApplicationDocumentStatus = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
}: ApplicationDocumentStatusTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/documents/status`
  );
  return res;
};

export const getJobAssignment = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
}: placeJobAssignmentTypes) => {
  const res = api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}`
  );
  return res;
};

type JobAssignmentTypes = {
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

export const terminateJobAssignment = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  data,
}: JobAssignmentTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/terminate`,
    data
  );
  return res;
};

type placeJobAssignmentTypes = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

export const placeJobAssignment = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
}: placeJobAssignmentTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/placement`
  );
  return res;
};

type editJobReqIdTypes = {
  facilityId: number;
  jobId: number;
  slotId: number;
  clientReqId: string;
};

export const editJobReqId = ({
  facilityId,
  jobId,
  slotId,
  clientReqId,
}: editJobReqIdTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/job-assignment/${slotId}`,
    {
      clientReqId,
    }
  );
  return res;
};

type updateJobSlotTypes = {
  facilityId: number;
  jobId: number;
  slotId: number;
  data: {
    reqId?: string;
    statusId?: number;
  };
};

type OpeningsAssignmentType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  jobApplicationId: number;
  jobAssignmentId: number;
};

export const getSlotStatus = () => {
  const res = api.get(`/api/v1/protected/modules/jobs/slot-status`);
  return res;
};

export const updateJobSlot = ({
  facilityId,
  jobId,
  slotId,
  data,
}: updateJobSlotTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/job-slot/${slotId}`,
    data
  );
  return res;
};

type declineAssignmentTypes = {
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

export const declineAssignment = ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
  value,
}: declineAssignmentTypes) => {
  const res = api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/decline`,
    {
      status: value,
    }
  );
  return res;
};

export const Openingsplacement = async ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
}: OpeningsAssignmentType) => {
  const placement = await api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/placement`
  );
  return placement;
};

export const openingsExtensionPlacement = async ({
  facilityId,
  jobId,
  professionalId,
  jobApplicationId,
  jobAssignmentId,
}: OpeningsAssignmentType) => {
  const placement = await api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/job-applications/${jobApplicationId}/job-assignment/${jobAssignmentId}/extension/placement`
  );
  return placement;
};
