import { CreateEmergencyContactType } from "../types/PersonalInformation";
import { PersonalDetailsType } from "../types/ProfessionalDocumentType";
import api from "./api";

export const getAdminFederalQuestions = async (professionalId: number) => {
  const response = api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/fedral-questions`
  );
  return response;
};

export const getAdminBackgroundQuestionsList = async (
  professionalId: number
) => {
  const response = api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/background-questions`
  );
  return response;
};

export const getAdminStates = async () => {
  const response = api.get(`/api/v1/protected/user/states`);
  return response;
};

export const getAdminCities = async (stateId: number) => {
  const response = api.get(`/api/v1/protected/user/city/${stateId}`);
  return response;
};

export const getAdminZip = async (cityId: number) => {
  const response = api.get(`/api/v1/protected/user/zip/${cityId}`);
  return response;
};

export const fetchEmergencyContactList = async (professionalId: number) => {
  const response = api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/emergency-contacts/list`
  );
  return response;
};

export const createAdminEmergencyContact = async (
  professionalId: number,
  data: CreateEmergencyContactType
) => {
  const response = api.post(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/emergency-contacts/create`,
    data
  );
  return response;
};

export const deleteAdminContact = async (
  professionalId: number,
  contactId: number
) => {
  const response = api.delete(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/emergency-contacts/delete/${contactId}`
  );
  return response;
};

export const editAdminContact = async (
  professionalId: number,
  contactId: number,
  contactDetails: CreateEmergencyContactType
) => {
  const response = api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/emergency-contacts/edit/${contactId}`,
    contactDetails
  );
  return response;
};

export const getAdminGig = async (professionalId: number) => {
  const response = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/details`
  );
  return response;
};

export const editPersonalDetials = async (
  professionalId: number,
  data: PersonalDetailsType
) => {
  const response = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/additionaldetails/personal-details/edit`,
    data
  );
  return response;
};
