import api from "./api";

export const getProfessionalsList = async (
  size: number,
  page: number,
  sortKey?: string,
  sortDir?: "ASC" | "DESC",
  search?: string,
  statusId?: number | string,
  stateId?: number | string,
  abortController?: AbortController
) => {
  const professionals = await api.get(
    `/api/v1/protected/modules/professionals/list?size=${size}&page=${page}&sortKey=${sortKey}&sortDir=${sortDir}&search=${search}&statusId=${statusId}&stateId=${stateId}`,
    {
      signal: abortController?.signal,
    }
  );
  return professionals?.data?.data[0];
};

export const getProfessionalStatusList = async () => {
  const professionalStatus = await api.get(
    `/api/v1/protected/modules/professionals/professional-status`
  );
  return professionalStatus?.data?.data;
};

export const changeProfessionalActivation = async (
  id: number,
  active: boolean
) => {
  const professional = await api.put(
    `/api/v1/protected/modules/professionals/activation/${id}`,
    {
      active,
    }
  );
  return professional;
};

export const deleteProfessional = async (professionalId: number) => {
  await api.delete(
    `/api/v1/protected/modules/professionals/delete/${professionalId}`
  );
};

export const addProfessional = async (
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
  preferredLocationIds: number[]
) => {
  const user = await api.post(`api/v1/protected/modules/professionals/create`, {
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
    preferredLocationIds,
  });
  return user;
};

export const getSpecialities = async () => {
  const professional = await api.get(
    `/api/v1/protected/modules/professionals/specialities`
  );
  return professional?.data?.data;
};

export const fetchProfessional = async (id: number) => {
  const professional = await api.get(
    `/api/v1/protected/modules/professionals/details/${id}`
  );
  return professional?.data?.data;
};

export const updateProfessional = async (
  id: number,
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
  const user = await api.put(
    `api/v1/protected/modules/professionals/edit/${id}`,
    {
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
    }
  );
  return user;
};

export type CreateWorkReferenceType = {
  professionalId: number;
  facilityName: string;
  referenceName: string;
  title: string;
  email: string;
  phone: string;
  canContact: boolean;
};

export const CreateWorkReference = async ({
  professionalId,
  facilityName,
  referenceName,
  title,
  email,
  phone,
  canContact,
}: CreateWorkReferenceType) => {
  const reference = await api.post(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/create`,
    {
      facilityName,
      referenceName,
      title,
      email,
      phone,
      canContact,
    }
  );
  return reference;
};

export const ListWorkReferences = async (professionalId: number) => {
  const references = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/list`
  );
  return references;
};

export const DeleteWorkReference = async (
  professionalId: number,
  referenceId: number
) => {
  const res = await api.delete(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/delete/${referenceId}`
  );
  return res;
};

export type EditWorkReferenceType = {
  professionalId: number;
  referenceId: number;
  facilityName: string;
  referenceName: string;
  title: string;
  email: string;
  phone: string;
  canContact: boolean;
};

export const EditWorkReference = async ({
  professionalId,
  referenceId,
  facilityName,
  referenceName,
  title,
  email,
  phone,
  canContact,
}: EditWorkReferenceType) => {
  const res = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/edit/${referenceId}`,
    {
      facilityName,
      referenceName,
      title,
      email,
      phone,
      canContact,
    }
  );
  return res;
};

export const fetchReferenceDetails = async (
  professionalId: number,
  referenceId: number
) => {
  const res = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/details/${referenceId}`
  );
  return res;
};

export const getRatingLevels = async (professionalId: number) => {
  const res = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/rating-levels`
  );
  return res;
};

export const getRatingParameters = async (professionalId: number) => {
  const res = await api.get(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/rating-parameters`
  );
  return res;
};

interface Rating {
  ratingParameterId: number;
  ratingLevelId: number;
}

export interface VerifyReferenceAPIType {
  professionalId: number;
  referenceId: number;
  facilityName: string;
  referenceName: string;
  title: string;
  email: string;
  phone: string;
  wouldHireAgain: boolean;
  additionalFeedback: string;
  rating: Rating[];
}

export const verifyReference = async ({
  professionalId,
  referenceId,
  facilityName,
  referenceName,
  title,
  email,
  phone,
  wouldHireAgain,
  additionalFeedback,
  rating,
}: VerifyReferenceAPIType) => {
  const res = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/verify/${referenceId}`,
    {
      facilityName,
      referenceName,
      title,
      email,
      phone,
      wouldHireAgain,
      additionalFeedback,
      rating,
    }
  );
  return res;
};

export const toggleShowOnSubmission = async ({
  professionalId,
  referenceId,
  showOnSubmission,
}: {
  professionalId: number;
  referenceId: number;
  showOnSubmission: boolean;
}) => {
  const res = await api.put(
    `/api/v1/protected/submodules/professionals/${professionalId}/details/references/show-on-submission/${referenceId}`,
    {
      showOnSubmission,
    }
  );
  return res;
};

export type ApplyProfessionalAPIType = {
  facilityId: number;
  jobId: number;
  professionalId: number;
  startDate: string;
  requestTimeOff: string[];
  bestTimeToSpeak: string;
  notes: string;
};

export const applyProfessional = async ({
  facilityId,
  jobId,
  professionalId,
  startDate,
  requestTimeOff,
  bestTimeToSpeak,
  notes,
}: ApplyProfessionalAPIType) => {
  const res = await api.post(
    `/api/v1/protected/modules/jobs/facility/${facilityId}/job/${jobId}/professional/${professionalId}/apply`,
    {
      startDate,
      requestTimeOff,
      bestTimeToSpeak,
      notes,
    }
  );
  return res;
};
