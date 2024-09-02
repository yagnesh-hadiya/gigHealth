import api from "./api";

type CreateActivity = {
  professionalId: number;
  data: {
    categoryId: number;
    notes: string;
  };
};

type EditActivity = {
  professionalId: number;
  activityId: number;
  data: {
    categoryId: number;
    notes: string;
  };
};

type DeleteActivity = {
  professionalId: number;
  activityId: number;
};

type CreateEmailActivity = {
  professionalId: number;
  data: {
    toEmail: string;
    subject: string;
    body: string;
  };
};

type ListActivities = {
  professionalId: number;
  size: number;
  page: number;
  search?: string;
  typeId?: string;
  startDate?: string;
  endDate?: string;
};

type ExportAsCsv = {
  professionalId: number;
  search?: string;
  typeId?: string;
  startDate?: string;
  endDate?: string;
};

class ProfessionalNotesServices {
  async getActivityTypes() {
    const res = await api.get("/api/v1/protected/master/activity-types");
    return res;
  }
  async getActivityCategories() {
    const res = await api.get("/api/v1/protected/master/activity-category");
    return res;
  }
  async createActivity({ professionalId, data }: CreateActivity) {
    const response = await api.post(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/create/activity`,
      data
    );
    return response;
  }

  async editActivity({ professionalId, data, activityId }: EditActivity) {
    const response = await api.put(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/edit/activity/${activityId}`,
      data
    );
    return response;
  }

  async deleteActivity({ professionalId, activityId }: DeleteActivity) {
    const response = await api.delete(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/delete/activity/${activityId}`
    );
    return response;
  }

  async createEmailActivity({ professionalId, data }: CreateEmailActivity) {
    const response = await api.post(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/create/email`,
      data
    );
    return response;
  }

  async listActivities({
    professionalId,
    size,
    page,
    search,
    typeId,
    startDate,
    endDate,
  }: ListActivities) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (typeId) {
      queryParams.append("typeId", typeId);
    }

    if (size) {
      queryParams.append("size", size.toString());
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/list${
        query ? `?${query}` : ""
      }`
    );
    return response;
  }

  async exportAsCsv({
    professionalId,
    search,
    typeId,
    startDate,
    endDate,
  }: ExportAsCsv) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }

    if (typeId) {
      queryParams.append("typeId", typeId);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    const query = queryParams.toString();

    const response = await api.get(
      `/api/v1/protected/submodules/professionals/${professionalId}/notes/export-as-csv${
        query ? `?${query}` : ""
      }`
    );
    return response;
  }
}

export default new ProfessionalNotesServices();
