import api from "./api";

export const getAnalytics = async () => {
    const response = await api.get("waste-records/analytics/");
    return response.data;
};