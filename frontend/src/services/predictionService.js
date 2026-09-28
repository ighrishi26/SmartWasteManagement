import api from "./api";

export const predictWaste = async (data) => {
    const response = await api.post(
        "waste-records/predict/",
        data
    );

    return response.data;
};