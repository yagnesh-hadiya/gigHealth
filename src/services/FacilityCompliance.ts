import api from "./api";

export const getDocumentCategories = async (facilityId: number | string) => {
  const categories = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/document-categories`
  );
  return categories.data.data;
};

export const listDocuments = async (facilityId: number | string) => {
  const documents = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/documents`
  );
  return documents.data.data;
};

export const createChecklist = async (
  facilityId: number | string,
  name: string,
  checklist: {
    categoryId: number;
    documents: {
      documentMasterId: number;
      isInternalUse: boolean;
      expiryDurationDays: number;
    }[];
  }[]
) => {
  await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/create`,
    {
      name,
      checklist,
    }
  );
};

export const editChecklist = async (
  facilityId: number | string,
  name: string,
  checklist: {
    categoryId: number;
    documents: {
      documentMasterId: number;
      isInternalUse: boolean;
      expiryDurationDays: number;
    }[];
  }[],
  checklistId: number
) => {
  await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/edit/${checklistId}`,
    {
      name,
      checklist,
    }
  );
};

export const listComplianceChecklist = async (
  facilityId: number | string,
  search?: string,
  abortController?: AbortController
) => {
  const list = await api.get(
    `api/v1/protected/submodules/facilities/${facilityId}/compliance/list${
      search ? `?search=${search}` : ""
    }`,
    {
      signal: abortController?.signal,
    }
  );
  return list.data.data;
};

export const getComplianceChecklist = async (
  facilityId: number | string,
  checklistId: number | string
) => {
  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/details/${checklistId}`
  );
  return list.data.data;
};

export const deleteComplianceChecklist = async (
  facilityId: number | string,
  checklistId: number | string
) => {
  await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/compliance/delete/${checklistId}`
  );
};
