import api from "./api";

export const getListJobTemplate = async (facilityId: number) => {
  const jobTemplates = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/list`
  );
  return jobTemplates;
};

export const getJobTemplateSpecialities = async (professionId: number) => {
  const specialities = await api.get(
    `/api/v1/protected/master/specialities/${professionId}`
  );
  return specialities;
};

export const getJobTemplateProfessions = async () => {
  const professtions = await api.get(
    `/api/v1/protected/master/profession-categories`
  );
  return professtions;
};

export const getJobTemplateJobStatus = async (facilityId: number) => {
  const jobStatus = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/job-status`
  );
  return jobStatus;
};

export const getJobTemplateScrubColor = async (facilityId: number) => {
  const scrubColor = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/scrub-color`
  );
  return scrubColor;
};

export const getJobTemplateComplianceList = async (facilityId: number) => {
  const complianceList = await api.get(
    `api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/compliance-list`
  );
  return complianceList;
};

export const getJobTemplateComplianceDetails = async (
  facilityId: number,
  complianceId: number
) => {
  const complianceDetails = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/compliance/${complianceId}`
  );
  return complianceDetails;
};

export const getJobTemplateEmploymentType = async (facilityId: number) => {
  const employmentType = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/employment-type`
  );
  return employmentType;
};

export const getJobTemplate = async (
  facilityId: number,
  templateId: number
) => {
  const template = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/template/${templateId}`
  );
  return template;
};

export const getJobStatus = async (facilityId: number) => {
  const jobStatus = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/job-status`
  );
  return jobStatus;
};

export const getJobContracts = async () => {
  const jobContract = await api.get(
    `/api/v1/protected/modules/facilities/contract-types`
  );
  return jobContract;
};

export const getJobDetails = async (facilityId: number, search: string) => {
  const details = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/list?search=${search}`
  );
  return details;
};

export const deleteJobTemplate = async (jobId: number, Id: number) => {
  return await api.delete(
    `/api/v1/protected/submodules/facilities/${jobId}/jobtemplates/delete/${Id}`
  );
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
};

export const createJobTemplate = async (jobTemplate: JobTemplate) => {
  const template = await api.post(
    `/api/v1/protected/submodules/facilities/${jobTemplate.facilityId}/jobtemplates/create`,
    jobTemplate
  );
  return template;
};

type EditJobTemplate = {
  facilityId: number;
  templateId: number;
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
};

export const editJobTemplate = async (jobTemplate: EditJobTemplate) => {
  const template = await api.put(
    `/api/v1/protected/submodules/facilities/${jobTemplate.facilityId}/jobtemplates/edit/${jobTemplate.templateId}`,

    jobTemplate
  );
  return template;
};

export const getDocumentsList = async (facilityId: number) => {
  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/document-categories`
  );
  return list;
};
