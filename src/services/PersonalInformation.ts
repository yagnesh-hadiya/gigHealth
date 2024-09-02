import api from "./api";
import {
  CreateEmergencyContactType,
  CreatePersonalInformationType,
} from "../types/PersonalInformation";

export const updatePersonalInformation = async (
  data: CreatePersonalInformationType
) => {
  const response = api.put(
    `/api/v1/talent/protected/user/personal-information/details`,
    data,
    { withCredentials: true }
  );
  return response;
};

export const getGenderList = async () => {
  const response = api.get(`/api/v1/talent/protected/master/gender`, {
    withCredentials: true,
  });
  return response;
};

export const getFederalQuestions = async () => {
  const response = api.get(
    `/api/v1/talent/protected/user/personal-information/fedral-questions`,
    {
      withCredentials: true,
    }
  );
  return response;
};

export const getEmergencyContactList = async () => {
  const response = api.get(
    `/api/v1/talent/protected/user/personal-information/emergency-contact`,
    { withCredentials: true }
  );
  return response;
};

export const createEmergencyContact = async (
  data: CreateEmergencyContactType
) => {
  const response = api.post(
    `/api/v1/talent/protected/user/personal-information/emergency-contact`,
    data,
    { withCredentials: true }
  );
  return response;
};

export const updateEmergencyContact = async (
  data: CreateEmergencyContactType,
  Id: number
) => {
  const response = api.put(
    `/api/v1/talent/protected/user/personal-information/emergency-contact/${Id}`,
    data,
    { withCredentials: true }
  );
  return response;
};

export const deleteEmergencyContact = async (Id: number) => {
  const response = api.delete(
    `/api/v1/talent/protected/user/personal-information/emergency-contact/${Id}`,
    { withCredentials: true }
  );
  return response;
};

export const updateFederalQuestions = async (
  federalQuestions: { questionId: number; optionId: number | boolean }[]
) => {
  const response = await api.put(
    `/api/v1/talent/protected/user/personal-information/fedral-questions`,
    {
      answers: federalQuestions,
    },
    { withCredentials: true }
  );
  return response;
};
