import api from './api';

export const getFacilityJobList = async (facilityId: number, size: number, page: number, abortController: AbortController, statusId?: number, search?: string) => {
    const params: Record<string, any> = {};

    statusId && (params['statusId'] = statusId);
    search && (params['search'] = search);
    size && (params['size'] = size);
    page && (params['page'] = page);

    const queryString = new URLSearchParams(params);

    const list = await api.get(`/api/v1/protected/submodules/facilities/${facilityId}/jobs/list?${queryString}`, {
        signal: abortController.signal
    });
    return list

}