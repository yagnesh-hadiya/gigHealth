import api from "./api";

export const getActivityModalCategories = async () => {
  const categories = await api.get(
    `/api/v1/protected/master/activity-category`
  );
  return categories;
};

export const postActivity = async (
  facilityId: number,
  categoryId: number,
  notes: string
) => {
  const activity = await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/create/activity`,
    {
      categoryId,
      notes,
    }
  );

  return activity;
};

export const postEmail = async (
  facilityId: number,
  toEmail: string,
  subject: string,
  body: string
) => {
  const email = await api.post(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/create/email`,
    {
      toEmail,
      subject,
      body,
    }
  );
  return email;
};

export const getNotesActivities = async () => {
  const activities = await api.get(`/api/v1/protected/master/activity-types`);
  return activities;
};

export const getNotesList = async (
  facilityId: number,
  size: number,
  page: number,
  search?: string,
  typeId?: number,
  startDate?: string,
  endDate?: string
) => {
  const params: Record<string, any> = {};

  size && (params["size"] = size);
  page && (params["page"] = page);
  search && (params["search"] = search);
  typeId && (params["typeId"] = typeId);
  startDate && (params["startDate"] = startDate);
  endDate && (params["endDate"] = endDate);

  const queryString: string = new URLSearchParams(params)?.toString();

  const list = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/list?${queryString}`
  );
  return list;
};

export const deleteCard = async (facilityId: number, noteId: number) => {
  const list = await api.delete(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/delete/activity/${noteId}`
  );
  return list;
};

export const editActivity = async (
  facilityId: number,
  activityId: number,
  categoryId: number,
  notes: string
) => {
  const activity = await api.put(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/edit/activity/${activityId}`,
    {
      categoryId,
      notes,
    }
  );
  return activity;
};

export const exortNotesToCSV = async (
  facilityId: number,
  search?: string,
  typeId?: number,
  startDate?: string,
  endDate?: string
) => {
  const params: Record<string, any> = {};

  search && (params["search"] = search);
  typeId && (params["typeId"] = typeId);
  startDate && (params["startDate"] = startDate);
  endDate && (params["endDate"] = endDate);

  const queryString: string = new URLSearchParams(params)?.toString();

  const csv = await api.get(
    `/api/v1/protected/submodules/facilities/${facilityId}/notes/export-as-csv?${queryString}`
  );
  return csv;
};

export const getDataFromAmazon = async (link: string) => {
  const linkOfExport = await api.get(`${link}`);
  return linkOfExport;
};
