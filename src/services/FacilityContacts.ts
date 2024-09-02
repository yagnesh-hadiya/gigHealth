import api from "./api";

export const getContactList = async (
  search: string,
  facilityId: number,
  abortController?: AbortController
) => {
  const contacts = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/contacts/list?search=${search}`,
    {
      signal: abortController?.signal,
    }
  );
  return contacts.data.data[0];
};

export const createContact = async (
  firstName: string,
  lastName: string,
  title: string,
  email: string,
  phone: string,
  fax: string | null,
  facilityRoleId: number,
  facilityId: number
) => {
  await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/contacts/create`,
    {
      firstName,
      lastName,
      title,
      email,
      phone,
      fax,
      facilityRoleId,
    }
  );
};

export const getFacilityRoles = async () => {
  const facilityRoles = await api.get(
    "/api/v1/protected/modules/facilities/facility-roles"
  );
  return facilityRoles.data.data;
};

export const deleteContact = async (contactId: number, facilityId: number) => {
  await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/contacts/delete/${contactId}`
  );
};

export const editContact = async (
  firstName: string,
  lastName: string,
  title: string,
  email: string,
  phone: string,
  fax: string | null,
  facilityRoleId: number,
  contactId: number,
  facilityId: number
) => {
  await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/contacts/edit/${contactId}`,
    {
      firstName,
      lastName,
      title,
      email,
      phone,
      fax,
      facilityRoleId,
    }
  );
};
