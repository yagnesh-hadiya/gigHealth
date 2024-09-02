import api from "./api";

export const getStateLocations = async () => {
  const locations = await api.get(`/api/v1/protected/user/states`);
  return locations;
};

export const getFacilityStatuses = async () => {
  const facilityStatus = await api.get(
    `/api/v1/protected/modules/facilities/statuses`
  );
  return facilityStatus;
};

export const getContractTypes = async () => {
  const contracts = await api.get(
    `/api/v1/protected/modules/facilities/contract-types`
  );
  return contracts;
};

export const getServiceTypes = async () => {
  const service = await api.get(
    `/api/v1/protected/modules/facilities/service-types`
  );
  return service;
};

export const getTraumaLevels = async () => {
  const trauma = await api.get(
    `/api/v1/protected/modules/facilities/taruma-levels`
  );
  return trauma;
};

export const getFacilityRoles = async () => {
  const roles = await api.get(
    `/api/v1/protected/modules/facilities/facility-roles`
  );
  return roles;
};

export const getFacilityCities = async (stateId: number) => {
  const cities = await api.get(`/api/v1/protected/user/city/${stateId}`);
  return cities;
};

export const getFacilityZipCode = async (cityId: number) => {
  const zipCode = await api.get(`/api/v1/protected/user/zip/${cityId}`);
  return zipCode;
};

export const getProgramManagers = async () => {
  const managers = await api.get(
    `/api/v1/protected/modules/facilities/program-managers`
  );
  return managers;
};

export const addFacility = async (
  name: string,
  statusId: number | null,
  type: string,
  parentHealthSystemId: string | number | undefined,
  isTeachingHospital: boolean,
  totalTalent: number,
  totalBedCount: number,
  traumaLevelId: number | null,
  contractTypeId: number | null,
  programManagerId: number | null,
  hospitalPhone: string,
  serviceTypeId: number | null,
  address: string,
  stateId: number | null,
  cityId: number | null,
  zipCodeId: number | null,
  healthSystemName: string,
  internalNotes: string,
  requirements: string,
  firstName: string | undefined,
  lastName: string | undefined,
  title: string | undefined,
  email: string | undefined,
  mobile: string | undefined,
  fax: string | null | undefined,
  facilityRoleId: number | null,
  secondaryFirstName: string | undefined,
  secondaryLastName: string | undefined,
  secondaryTitle: string | undefined,
  secondaryEmail: string | undefined,
  secondaryMobile: string | undefined,
  secondaryFax: string | null | undefined,
  secondaryFacilityRoleId: number | null,
  isPrimaryContactFilled: any,
  isSecondaryContactFilled: any
) => {
  const facility = await api.post(
    `/api/v1/protected/modules/facilities/create`,
    {
      name,
      statusId,
      type,
      parentHealthSystemId,
      isTeachingHospital,
      totalTalent,
      totalBedCount,
      traumaLevelId,
      contractTypeId,
      programManagerId,
      hospitalPhone,
      serviceTypeId,
      address,
      stateId,
      cityId,
      zipCodeId,
      healthSystemName,
      internalNotes,
      requirements,
      ...(isPrimaryContactFilled && {
        primaryContact: {
          firstName: firstName,
          lastName: lastName,
          title: title,
          email: email,
          mobile: mobile,
          fax: fax,
          facilityRoleId: facilityRoleId,
        },
      }),
      ...(isSecondaryContactFilled && {
        secondaryContact: {
          firstName: secondaryFirstName,
          lastName: secondaryLastName,
          title: secondaryTitle,
          email: secondaryEmail,
          mobile: secondaryMobile,
          fax: secondaryFax,
          facilityRoleId: secondaryFacilityRoleId,
        },
      }),
    }
  );
  return facility;
};

export const getFacilityId = async () => {
  const facilityId = await api.get(
    `/api/v1/protected/modules/facilities/facilityId/next`
  );
  return facilityId;
};

export const getHealthSystemId = async () => {
  const healthSystemId = await api.get(
    `/api/v1/protected/modules/facilities/healthSystemId/next`
  );
  return healthSystemId;
};

export const gethealthSystemName = async () => {
  const healthSystemName = await api.get(
    `/api/v1/protected/modules/facilities/health-systems`
  );
  return healthSystemName;
};

export const getFacilityList = async (
  size: number,
  page: number,
  search: string,
  stateId: number | string
) => {
  const facilityStatus = await api.get(
    `/api/v1/protected/modules/facilities/list?size=${size}&page=${page}&stateId=${stateId}&search=${search}`
  );
  return facilityStatus?.data?.data[0];
};

export const deleteFaciltiy = async (facilityId: number) => {
  const deletedFaciity = await api.delete(
    `/api/v1/protected/modules/facilities/delete/${facilityId}`
  );
  return deletedFaciity;
};

export const getFacilityListData = async (facilityId: number) => {
  const facilityData = await api.get(
    `/api/v1/protected/modules/facilities/facility/${facilityId}`
  );
  return facilityData;
};

export const editFacility = async (
  facilityId: number,
  name: string,
  statusId: number | null,
  type: string,
  parentHealthSystemId: string | number | undefined,
  isTeachingHospital: boolean,
  totalTalent: number,
  totalBedCount: number,
  traumaLevelId: number | null,
  contractTypeId: number | null,
  programManagerId: number | null,
  hospitalPhone: string,
  serviceTypeId: number | null,
  address: string,
  stateId: number | null,
  cityId: number | null,
  zipCodeId: number | null,
  healthSystemName: string,
  internalNotes: string,
  requirements: string,
  firstName: string | undefined,
  lastName: string | undefined,
  title: string | undefined,
  email: string | undefined,
  mobile: string | undefined,
  fax: string | null | undefined,
  facilityRoleId: number | null,
  secondaryFirstName: string | undefined,
  secondaryLastName: string | undefined,
  secondaryTitle: string | undefined,
  secondaryEmail: string | undefined,
  secondaryMobile: string | undefined,
  secondaryFax: string | null | undefined,
  secondaryFacilityRoleId: number | null,
  isPrimaryContactFilled: any,
  isSecondaryContactFilled: any
) => {
  const facility = await api.put(
    `/api/v1/protected/modules/facilities/edit/${facilityId}`,
    {
      name,
      statusId,
      type,
      parentHealthSystemId,
      isTeachingHospital,
      totalTalent,
      totalBedCount,
      traumaLevelId,
      contractTypeId,
      programManagerId,
      hospitalPhone,
      serviceTypeId,
      address,
      stateId,
      cityId,
      zipCodeId,
      healthSystemName,
      internalNotes,
      requirements,
      ...(isPrimaryContactFilled && {
        primaryContact: {
          firstName: firstName,
          lastName: lastName,
          title: title,
          email: email,
          mobile: mobile,
          facilityRoleId: facilityRoleId,
          fax: fax,
        },
      }),
      ...(isSecondaryContactFilled && {
        secondaryContact: {
          firstName: secondaryFirstName,
          lastName: secondaryLastName,
          title: secondaryTitle,
          email: secondaryEmail,
          mobile: secondaryMobile,
          facilityRoleId: secondaryFacilityRoleId,
          fax: secondaryFax,
        },
      }),
    }
  );
  return facility;
};

export const uploadImageToBucket = async (
  userId: number,
  facilityPicture: File
) => {
  const imageResponse = await api.post(
    `/api/v1/protected/modules/facilities/upload/${userId}`,
    { facilityPicture },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return imageResponse;
};

export const editImageToBucket = async (
  userId: number | undefined,
  facilityPicture: File
) => {
  const imageResponse = await api.put(
    `/api/v1/protected/modules/facilities/upload/${userId}`,
    { facilityPicture },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return imageResponse;
};

export const getFacilityJobShifts = async (facilityId: number) => {
  const shifts = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/jobtemplates/job-shifts`
  );
  return shifts;
};
