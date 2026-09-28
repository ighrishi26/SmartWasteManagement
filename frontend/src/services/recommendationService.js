import api from "./api";

export const getRecommendations = async () => {
    const response = await api.get(
        "waste-records/recommendations/"
    );

    return response.data;
};