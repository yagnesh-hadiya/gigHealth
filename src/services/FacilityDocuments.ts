import { DocumentParamsType } from "../types/FacilityDocument";
import api from "./api";

export const addFacilityDocument = async (
  facilityId: number,
  { name, description, document }: DocumentParamsType
) => {
  const response = await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/facilitydocuments/create`,
    { name, description, document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const fetchDocuments = async (
  facilityId: number,
  search: string,
  abortController?: AbortController
) => {
  const documents = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/facilitydocuments/list?search=${search}`,
    {
      signal: abortController?.signal,
    }
  );
  return documents;
};

export const deleteDocument = async (
  facilityId: number,
  documentId: number
) => {
  return await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/facilitydocuments/delete/${documentId}`
  );
};

export const editDocument = async (
  facilityId: number,
  { name, description, document }: DocumentParamsType,
  documentId: number
) => {
  const documentData = await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/facilitydocuments/edit/${documentId}`,
    { name, description, document },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return documentData;
};

export const getDocumentById = async (
  facilityId: number,
  documentId: number
) => {
  const response = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/facilitydocuments/download/${documentId}`
  );
  return response;
};
