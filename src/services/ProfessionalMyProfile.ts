import { questionAnswerType } from "../types/ProfessionalDetails";
import {
  ProfessionalCreateReferenceType,
  ProfessionalWorkHistoryParams,
} from "../types/ProfessionalMyProfile";
import api from "./professionalApi";

export const uploadImageProfessionals = async (profilePic: File) => {
  const status = await api.put(
    `/api/v1/talent/protected/user/upload`,
    { profilePic },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return status;
};

export const getProfessionalShifts = async () => {
  const shifts = await api.get(`/api/v1/talent/master/job-shifts`);
  return shifts;
};

export const getProfessionalTrauma = async () => {
  const shifts = await api.get(`/api/v1/talent/master/taruma-levels`);
  return shifts;
};

export const createProfessionalWorkHistory = async ({
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
}: ProfessionalWorkHistoryParams) => {
  const response = await api.post(
    `/api/v1/talent/protected/user/workhistory/create`,
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

export const getProfessionalWorkHistory = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/workhistory/list`
  );
  return response;
};

export const editProfessionalWorkHistory = async ({
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
  Id,
}: ProfessionalWorkHistoryParams) => {
  const response = await api.put(
    `/api/v1/talent/protected/user/workhistory/edit/${Id}`,
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

export const deleteProfessionalWorkHistory = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/workhistory/delete/${Id}`
  );
  return response;
};

export const ListProfessionalWorkReferences = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/reference/list`
  );
  return response;
};

export const CreateProfessionalWorkReference = async ({
  FacilityName,
  ReferenceName,
  Title,
  Email,
  Phone,
  CanContact,
}: ProfessionalCreateReferenceType) => {
  const reference = await api.post(
    `/api/v1/talent/protected/user/reference/create`,
    {
      facilityName: FacilityName,
      referenceName: ReferenceName,
      title: Title,
      email: Email,
      phone: Phone,
      canContact: CanContact,
    }
  );
  return reference;
};

export const EditProfessionalWorkReference = async ({
  Id,
  FacilityName,
  ReferenceName,
  Title,
  Email,
  Phone,
  CanContact,
}: ProfessionalCreateReferenceType) => {
  const reference = await api.put(
    `/api/v1/talent/protected/user/reference/edit/${Id}`,
    {
      facilityName: FacilityName,
      referenceName: ReferenceName,
      title: Title,
      email: Email,
      phone: Phone,
      canContact: CanContact,
    }
  );
  return reference;
};

export const deleteProfessionalReference = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/reference/delete/${Id}`
  );
  return response;
};

export const createProfessionalEducation = async (
  degree: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  isCurrentlyAttending: boolean
) => {
  const education = await api.post(
    `/api/v1/talent/protected/user/education/create`,
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

export const editProfessionalEducation = async (
  Id: number,
  degree: string,
  school: string,
  location: string,
  startDate: string,
  endDate: string,
  isCurrentlyAttending: boolean
) => {
  const education = await api.put(
    `/api/v1/talent/protected/user/education/edit/${Id}`,
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

export const getProfessionalEducationList = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/education/list`
  );
  return response;
};

export const deleteProfessionalEducation = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/education/delete/${Id}`
  );
  return response;
};

export const getProfessionalLicenseList = async () => {
  const response = await api.get(`/api/v1/talent/protected/user/license/list`);
  return response;
};

export const getProfessionalCertficationList = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/certification/list`
  );
  return response;
};

export const createLicence = async (
  name: string,
  licenseNumber: string,
  expiryDate: string,
  isActiveCompact: boolean,
  stateId: number
) => {
  const licenses = await api.post(
    `/api/v1/talent/protected/user/license/create`,
    { name, licenseNumber, expiryDate, isActiveCompact, stateId }
  );
  return licenses;
};

export const editLicence = async (
  Id: number,
  name: string,
  licenseNumber: string,
  expiryDate: string,
  isActiveCompact: boolean,
  stateId: number
) => {
  const licenses = await api.put(
    `/api/v1/talent/protected/user/license/edit/${Id}`,
    { name, licenseNumber, expiryDate, isActiveCompact, stateId }
  );
  return licenses;
};

export const deleteProfessionalLicense = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/license/delete/${Id}`
  );
  return response;
};

export const createProfessionalCertification = async (
  name: string,
  expiryDate: string
) => {
  const certifications = await api.post(
    `/api/v1/talent/protected/user/certification/create`,
    { name, expiryDate }
  );
  return certifications;
};

export const editProfessionalCertification = async (
  Id: number,
  name: string,
  expiryDate: string
) => {
  const certifications = await api.put(
    `/api/v1/talent/protected/user/certification/edit/${Id}`,
    { name, expiryDate }
  );
  return certifications;
};

export const deleteProfessionalCertification = async (Id: number) => {
  const response = await api.delete(
    `/api/v1/talent/protected/user/certification/delete/${Id}`
  );
  return response;
};

export const editProfessionalProfile = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  stateId: number,
  cityId: number,
  zipCodeId: number,
  professionId: number,
  primarySpecialityId: number,
  experience: number,
  statusId: number,
  preferredLocationIds: number[]
) => {
  const user = await api.put(`/api/v1/talent/protected/user/edit`, {
    firstName,
    lastName,
    email,
    phone,
    address,
    stateId,
    cityId,
    zipCodeId,
    professionId,
    primarySpecialityId,
    experience,
    statusId,
    preferredLocationIds,
  });
  return user;
};

export const getProfessionalBgQuestions = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/additional-details/background-questions`
  );

  return response;
};

export const getProfessionalDocument = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/documents/core-compliance`
  );
  return response;
};

export const getProfessionalUploadedComplianceDocs = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/documents/core-compliance/list`
  );
  return response;
};

export const getProfessionalAdditionalDetails = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/master/discovered-by-gig`
  );
  return response;
};

export const updateAdditionalDetails = async (
  dob: string | null,
  ssn: string | null,
  discoveredGigId: number | undefined | null,
  referralId: number | null,
  otherReferral: string | null
) => {
  const response = await api.put(
    `/api/v1/talent/protected/user/additional-details/details`,
    { dob, ssn, discoveredGigId, referralId, otherReferral },
    { withCredentials: true }
  );
  return response;
};

export const uploadSignatureProfessionals = async (signature: File) => {
  const status = await api.put(
    `/api/v1/talent/protected/user/additional-details/upload-signature`,
    { signature },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return status;
};

export const getAdditionalDetails = async () => {
  const response = await api.get(
    `/api/v1/talent/protected/user/additional-details/details`
  );
  return response;
};

export const uploadBackgroundQuestions = async (
  questionAnswer: questionAnswerType[]
) => {
  const response = await api.put(
    `/api/v1/talent/protected/user/additional-details/background-questions`,
    { answers: [...questionAnswer] }
  );
  return response;
};
