import api from "./api";

export const addDeviceToken = async (deviceToken: string) => {
    await api.put('/api/v1/protected/auth/device-token', {
        deviceToken
    });
}