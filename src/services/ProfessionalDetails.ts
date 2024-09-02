import api from "./api";

export const fetchProfessionalHeaderDetails = async (
  professionalId: number
) => {
  const details = await api.get(
    `/api/v1/protected/modules/professionals/details/${professionalId}`
  );
  return details;
};

export const toggleActivation = async (
  professionalId: number,
  active: boolean
) => {
  const activation = await api.put(
    `/api/v1/protected/modules/professionals/activation/${professionalId}`,
    {
      active,
    }
  );
  return activation;
};

export const changeProgramManager = async (
  professionalId: number,
  employeeId: number
) => {
  const manager = await api.put(
    `/api/v1/protected/modules/professionals/update-program-manager/${professionalId}`,
    {
      employeeId,
    }
  );
  return manager;
};

export const changeEmploymentExpert = async (
  professionalId: number,
  employeeId: number
) => {
  const manager = await api.put(
    `/api/v1/protected/modules/professionals/update-employment-expert/${professionalId}`,
    {
      employeeId,
    }
  );
  return manager;
};

export const fetchProgramManager = async () => {
  const manager = await api.get(
    `/api/v1/protected/modules/professionals/program-managers`
  );
  return manager;
};

export const fetchEmploymentExpert = async () => {
  const employment = await api.get(
    `/api/v1/protected/modules/professionals/employment-experts`
  );
  return employment;
};

export const getProfessionalStatus = async () => {
  const status = await api.get(
    `/api/v1/protected/modules/professionals/professional-status`
  );
  return status;
};

export const uploadImageToProfessionals = async (
  professionalId: number,
  profilePic: File
) => {
  const status = await api.put(
    `/api/v1/protected/modules/professionals/upload/${professionalId}`,
    { profilePic },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return status;
};

export const createProfessionalLicence = async (
  professionalId: number,
  name: string,
  licenseNumber: string,
  expiryDate: string,
  isActiveCompact: boolean,
  stateId: number
) => {
  const licenses = await api.post(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/licenses/create`,
    { name, licenseNumber, expiryDate, isActiveCompact, stateId }
  );
  return licenses;
};

export const getLicenseList = async (professionalId: number) => {
  const list = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/licenses/list`
  );
  return list;
};

export const deleteLicense = async (
  professionalId: number,
  licenseId: number
) => {
  const deletedLicense = await api.delete(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/licenses/delete/${licenseId}`
  );
  return deletedLicense;
};

export const editProfessionalLicence = async (
  professionalId: number,
  Id: number,
  name: string,
  licenseNumber: string,
  expiryDate: string,
  isActiveCompact: boolean,
  stateId: number
) => {
  const licenses = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/licenses/edit/${Id}`,
    { name, licenseNumber, expiryDate, isActiveCompact, stateId }
  );
  return licenses;
};

export const createCertification = async (
  professionId: number,
  name: string,
  expiryDate: string
) => {
  const certifications = await api.post(
    `/api/v1/protected/submodules/professionals/${professionId}/details/certifications/create`,
    { name, expiryDate }
  );
  return certifications;
};

export const getCertficationList = async (professionalId: number) => {
  const certificates = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/certifications/list`
  );
  return certificates;
};

export const deleteCertification = async (
  professionalId: number,
  certificateId: number
) => {
  const deletedCertificate = await api.delete(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/certifications/delete/${certificateId}`
  );
  return deletedCertificate;
};

export const editCertification = async (
  professionId: number,
  certificateId: number,
  name: string,
  expiryDate: string
) => {
  const certifications = await api.put(
    `/api/v1/protected/submodules/professionals/${professionId}/details/certifications/edit/${certificateId}`,
    { name, expiryDate }
  );
  return certifications;
};

export const createEducation = async (
  professionalId: number,
  degree: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  isCurrentlyAttending: boolean
) => {
  const education = await api.post(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/education/create`,
    {
      degree,
      school,
      location,
      startDate,
      isCurrentlyAttending,
      endDate,
    }
  );
  return education;
};

export const getEducationLists = async (professionalId: number) => {
  const list = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/education/list`
  );
  return list;
};

export const deleteEducationCard = async (
  professionId: number,
  educationId: number
) => {
  const deletedCertificate = await api.delete(
    `/api/v1/protected/submodules/professionals/${professionId}/details/education/delete/${educationId}`
  );
  return deletedCertificate;
};

export const editEducation = async (
  professionalId: number,
  educationId: number,
  degree: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  isCurrentlyAttending: boolean
) => {
  const education = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/education/edit/${educationId}`,
    {
      degree,
      school,
      location,
      startDate,
      isCurrentlyAttending,
      endDate,
    }
  );
  return education;
};

type WorkHistoryParams = {
  professionalId: number;
  startDate: string;
  endDate: string | null;
  isCurrentlyWorking: boolean;
  facilityName: string;
  stateId: number;
  facilityType: string;
  professionId: number;
  specialityId: number;
  nurseToPatientRatio?: string | null;
  facilityBeds: string | number | null;
  bedsInUnit: string | number | null;
  isTeachingFacility?: boolean;
  isMagnetFacility?: boolean;
  isTraumaFacility?: boolean;
  traumaLevelId?: number | null;
  additionalInfo?: string | null;
  positionHeld: string;
  agencyName?: string | null;
  isChargeExperience?: boolean | string | null;
  isChartingSystem?: boolean | null;
  shiftId?: number | null;
  reasonForLeaving?: string | null;
};

export const createWorkHistory = async ({
  professionalId,
  startDate,
  endDate,
  isCurrentlyWorking,
  facilityName,
  stateId,
  facilityType,
  professionId,
  specialityId,
  nurseToPatientRatio,
  bedsInUnit,
  isTeachingFacility,
  isMagnetFacility,
  isTraumaFacility,
  traumaLevelId,
  shiftId,
  reasonForLeaving,
  isChartingSystem,
  isChargeExperience,
  agencyName,
  positionHeld,
  additionalInfo,
  facilityBeds,
}: WorkHistoryParams) => {
  const response = await api.post(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/workhistory/create`,
    {
      startDate,
      endDate,
      isCurrentlyWorking,
      facilityName,
      stateId,
      facilityType,
      professionId,
      specialityId,
      nurseToPatientRatio,
      bedsInUnit,
      isTeachingFacility,
      isMagnetFacility,
      isTraumaFacility,
      traumaLevelId,
      shiftId,
      reasonForLeaving,
      isChartingSystem,
      isChargeExperience,
      agencyName,
      positionHeld,
      additionalInfo,
      facilityBeds,
    }
  );
  return response;
};

type EditWorkHistoryParams = {
  professionalId: number;
  workHistoryId: number;
  startDate: string;
  endDate: string | null;
  isCurrentlyWorking: boolean;
  facilityName: string;
  stateId: number;
  facilityType: string;
  professionId: number;
  specialityId: number;
  nurseToPatientRatio?: string | null;
  facilityBeds: string | number | null;
  bedsInUnit: string | number | null;
  isTeachingFacility?: boolean;
  isMagnetFacility?: boolean;
  isTraumaFacility?: boolean;
  traumaLevelId?: number | null;
  additionalInfo?: string | null;
  positionHeld: string;
  agencyName?: string | null;
  isChargeExperience?: boolean | string | null;
  isChartingSystem?: boolean | null;
  shiftId?: number | null;
  reasonForLeaving?: string | null;
};

export const editWorkHistory = async ({
  professionalId,
  workHistoryId,
  startDate,
  endDate,
  isCurrentlyWorking,
  facilityName,
  stateId,
  facilityType,
  professionId,
  specialityId,
  nurseToPatientRatio,
  bedsInUnit,
  isTeachingFacility,
  isMagnetFacility,
  isTraumaFacility,
  traumaLevelId,
  shiftId,
  reasonForLeaving,
  isChartingSystem,
  isChargeExperience,
  agencyName,
  positionHeld,
  additionalInfo,
  facilityBeds,
}: EditWorkHistoryParams) => {
  const response = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/workhistory/edit/${workHistoryId}`,
    {
      startDate,
      endDate,
      isCurrentlyWorking,
      facilityName,
      stateId,
      facilityType,
      professionId,
      specialityId,
      nurseToPatientRatio,
      bedsInUnit,
      isTeachingFacility,
      isMagnetFacility,
      isTraumaFacility,
      traumaLevelId,
      shiftId,
      reasonForLeaving,
      isChartingSystem,
      isChargeExperience,
      agencyName,
      positionHeld,
      additionalInfo,
      facilityBeds,
    }
  );
  return response;
};

export const fetchWorkHistory = async (professionalId: number) => {
  const response = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/workhistory/list`
  );
  return response;
};

export const deleteWorkHistory = async (
  professionalId: number,
  workHistoryId: number
) => {
  const response = await api.delete(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/workhistory/delete/${workHistoryId}`
  );
  return response;
};

export const uploadProfessionalDocuments = async (
  Id: number,
  document: File
) => {
  const response = await api.post(
    `/api/v1/talent/protected/user/documents/core-compliance/upload/${Id}`,
    { document: document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response;
};

export const deleteCoreComplianceDocument = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/documents/core-compliance/delete/${Id}`,
    { withCredentials: true }
  );
  return response;
};

export const downloadCoreComplianceDocument = async (Id: number) => {
  const response = await api.get(
    `/api/v1/talent/protected/user/documents/professional-document/download/${Id}`,
    { withCredentials: true, responseType: "blob" }
  );
  return response;
};

export const uploadOnboardingRequiredDoc = async (
  document: File,
  jobId: number,
  jobApplicationId: number,
  documentId: number
) => {
  const response = await api.put(
    `/api/v1/talent/protected/jobs/job/${jobId}/job-application/${jobApplicationId}/upload/${documentId}`,
    { document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return response;
};
