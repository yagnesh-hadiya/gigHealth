import api from "./api";

export const fetchLocationList = async (facilityId:number) => {
  const result = await api.get(`/api/v1/protected/submodules/facilities/${facilityId}/location/facilities`);
  return result.data.data;
};

export const deleteFacility = async (Id: number) => {
  await api.delete(
    `/api/v1/protected/modules/facilities/delete/${Id}`
  );
};