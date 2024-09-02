import api from "./api";

type getProfessionalDocumentType = {
  professionalId: number;
  search?: string;
  size?: number;
  page?: number;
  abortController?: AbortController;
};

type downloadProfessionalDocumentType = {
  professionalId: number;
  documentId: number;
};

export type CreateProfessionalDocumentType = {
  professionalId: number;
  document: File;
  documentMasterId: number;
};

export type EditProfessionalDocumentType = {
  professionalId: number;
  document: File;
  documentId: number;
};

class ProfessionalDocumentServices {
  public async getProfessionalDocuments({
    professionalId,
    size,
    page,
    search,
    abortController,
  }: getProfessionalDocumentType) {
    const queryParams = new URLSearchParams();

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (search) {
      queryParams.append("search", search);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/documents/list${
        query ? `?${query}` : ""
      }`,
      {
        signal: abortController?.signal,
      }
    );
    return response;
  }

  public async downloadProfessionalDocument({
    professionalId,
    documentId,
  }: downloadProfessionalDocumentType) {
    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/documents/download/${documentId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  }

  public async deleteProfessionalDocument({
    professionalId,
    documentId,
  }: downloadProfessionalDocumentType) {
    const response = await api.delete(
      `/api/v1/protected/submodules/professionals/${professionalId}/documents/delete/${documentId}`
    );
    return response;
  }

  public async createProfessionalDocument({
    professionalId,
    document,
    documentMasterId,
  }: CreateProfessionalDocumentType) {
    const formData = new FormData();
    formData.append("document", document);
    formData.append("documentMasterId", documentMasterId.toString());

    const response = await api.post(
      `/api/v1/protected/submodules/professionals/${professionalId}/documents/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  public async editProfessionalDocument({
    professionalId,
    documentId,
    document,
  }: EditProfessionalDocumentType) {
    const formData = new FormData();
    formData.append("document", document);

    const response = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/documents/edit/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
}

export default new ProfessionalDocumentServices();
