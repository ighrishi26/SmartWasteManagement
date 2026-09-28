import api from "./api";

export const getAnomalies = async () => {
    const response = await api.get("waste-records/anomalies/");
    return response.data;
};