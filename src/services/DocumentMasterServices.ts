import api from "./api";

export const createDocumentMaster = async (
  name: string,
  description: string,
  isCoreCompliance: boolean
) => {
  await api.post(`/api/v1/protected/modules/documentmaster/create`, {
    name,
    description,
    isCoreCompliance,
  });
};

export const listDocumentMasterList = async () => {
  const result = await api.get(`/api/v1/protected/modules/documentmaster/list`);
  return result;
};

export const fetchDocumentMasterList = async (
  search: string,
  abortController: AbortController
) => {
  const result = await api.get(
    `/api/v1/protected/modules/documentmaster/list?search=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return result.data.data;
};

export const deleteDocumentMaster = async (documentId: number) => {
  await api.delete(
    `/api/v1/protected/modules/documentmaster/delete/${documentId}`
  );
};

export const editDocumentMaster = async (
  documentId: number,
  name: string,
  description: string,
  isCoreCompliance: boolean
) => {
  await api.put(`/api/v1/protected/modules/documentmaster/edit/${documentId}`, {
    name,
    description,
    isCoreCompliance,
  });
};
