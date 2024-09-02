import api from "./api";

export const publishJob = async (facilityId: number) => {
  const publisedhJobs = await api.post(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/create`
  );
  return publisedhJobs;
};

export const getNextJobId = async (facilityId: number) => {
  const jobId = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/jobId/next`
  );
  return jobId;
};

export const getJobTemplateList = async (facilityId: number) => {
  const jobId = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job-templates/list`
  );
  return jobId;
};

export const getJobDetails = async (
  facilityId: number | string,
  jobId: number | string
) => {
  const details = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/details/${jobId}`
  );
  return details;
};

export const getJobTemplateDetails = async (
  facilityId: number | string,
  templateId: number | string
) => {
  const jobDetails = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job-templates/${templateId}`
  );
  return jobDetails;
};

export const getActiveContract = async (facilityId: number) => {
  const activeContract = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/active-contract`
  );
  return activeContract;
};

export const getComplianceList = async (facilityId: number) => {
  const complianceList = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/compliance/list`
  );
  return complianceList;
};

export const getComplianceDetails = async (
  facilityId: number,
  complianceId: number
) => {
  const complianceDetails = await api.get(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/compliance/${complianceId}`
  );
  return complianceDetails;
};

export const getDocumentCategories = async () => {
  const documentCategories = await api.get(
    `/api/v1/protected/modules/jobs/document-categories`
  );
  return documentCategories;
};

export const getFacilityList = async () => {
  const facilityList = await api.get(
    `/api/v1/protected/modules/jobs/facility-list`
  );
  return facilityList;
};

export const getProfessions = async () => {
  const professions = await api.get(
    `/api/v1/protected/master/profession-categories`
  );
  return professions;
};

export const getJobSpecialities = async (professionId: number) => {
  const specialities = await api.get(
    `/api/v1/protected/master/specialities/${professionId}`
  );
  return specialities;
};

export const getJobStatuses = async () => {
  const jobStatus = await api.get(`/api/v1/protected/modules/jobs/job-status`);
  return jobStatus;
};

export const getEmploymentType = async () => {
  const employmentType = await api.get(
    `/api/v1/protected/modules/jobs/employment-type`
  );
  return employmentType;
};

export const getScrubColor = async () => {
  const scrubColor = await api.get(
    `/api/v1/protected/modules/jobs/scrub-color`
  );
  return scrubColor;
};

export const getJobShifts = async () => {
  const shifts = await api.get(`/api/v1/protected/modules/jobs/job-shifts`);
  return shifts;
};

export const getProfessionsCategories = async (professionId: number) => {
  const professions = await api.get(
    `/api/v1/protected/master/professions/${professionId}`,
    {
      withCredentials: true,
    }
  );
  return professions;
};

type JobTemplate = {
  facilityId: number;
  title: string;
  billRate: number;
  professionId: number;
  jobStatusId: number;
  specialityId: number;
  minYearsOfExperience: number;
  contract: string;
  jobType: string;
  noOfOpenings: number;
  location: string;
  deptUnit: number;
  employementTypeId: number;
  scrubColorId: number;
  description: string;
  internalJobNotes: string;
  complianceChecklistId: number;
  postToWebsite: boolean;
  contractDetails: {
    startDate: string;
    shiftStartTime: string;
    shiftEndTime: string;
    noOfShifts: number;
    contractLength: number;
    hrsPerWeek: number;
    shiftId: number;
    daysOnAssignment: number;
    overtimeHrsPerWeek?: number;
  };
  pay: {
    hourlyRate: number;
    housingStipend: number;
    mealsAndIncidentals: number;
    compensationComments?: string;
    overtimeRate: number;
    holidayRate: number;
    onCallRate: number;
    callBackRate: number;
    travelReimbursement: number;
    doubleTimeRate?: number;
  };
  reqIds?: {
    slotNumber: number;
    reqId: string;
  }[];
};

export const saveJobTemplate = async (jobTemplate: JobTemplate) => {
  const template = await api.post(
    `/api/v1/protected/modules/jobs/facility/${jobTemplate.facilityId}/save-as-template`,

    jobTemplate
  );
  return template;
};

export const createJob = async (jobTemplate: JobTemplate) => {
  const jobs = await api.post(
    `/api/v1/protected/modules/jobs/facility/${jobTemplate.facilityId}/create`,

    jobTemplate
  );
  return jobs;
};

export const editJob = async (id: number, jobTemplate: JobTemplate) => {
  const jobs = await api.put(
    `/api/v1/protected/modules/jobs/facility/${jobTemplate.facilityId}/edit/${id}`,

    jobTemplate
  );
  return jobs;
};

export const getJobsList = async (
  size: number,
  page: number,
  search: string,
  abortController: AbortController,
  sortKey: string,
  sortDir: string,
  statusId?: number,
  professionId?: number,
  specialityId?: number,
  stateId?: number,
  shiftId?: number,
  startDate?: string,
  endDate?: string
) => {
  const params: Record<string, any> = {};

  size && (params["size"] = size);
  page && (params["page"] = page);
  search && (params["search"] = search);
  statusId && (params["statusId"] = statusId);
  professionId && (params["professionId"] = professionId);
  stateId && (params["stateId"] = stateId);
  specialityId && (params["specialityId"] = specialityId);
  shiftId && (params["shiftId"] = shiftId);
  startDate && (params["startDate"] = startDate);
  endDate && (params["endDate"] = endDate);
  sortKey && (params["sortKey"] = sortKey);
  sortDir && (params["sortDir"] = sortDir);

  const queryString: string = new URLSearchParams(params).toString();
  const list = await api.get(
    `/api/v1/protected/modules/jobs/list?${queryString}`,
    {
      signal: abortController.signal,
    }
  );
  return list;
};

export const updateJobStatus = async (
  facilityId: number,
  jobId: number,
  statusId: number
) => {
  const updatedJobStatus = await api.put(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/status/${jobId}`,
    {
      statusId,
    }
  );
  return updatedJobStatus;
};

export const exportJobsToCSV = async (
  sortKey?: string,
  sortDir?: string,
  statusId?: number,
  professionId?: number,
  specialityId?: number,
  stateId?: number,
  shiftId?: number,
  search?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: Record<string, any> = {};

  sortKey && (params["sortKey"] = sortKey);
  sortDir && (params["sortDir"] = sortDir);
  statusId && (params["statusId"] = statusId);
  professionId && (params["professionId"] = professionId);
  specialityId && (params["specialityId"] = specialityId);
  stateId && (params["stateId"] = stateId);
  shiftId && (params["shiftId"] = shiftId);
  search && (params["search"] = search);
  startDate && (params["startDate"] = startDate);
  endDate && (params["endDate"] = endDate);

  const queryString: string = new URLSearchParams(params).toString();
  const csv = await api.get(
    `/api/v1/protected/modules/jobs/export-to-csv?${queryString}`
  );
  return csv;
};
