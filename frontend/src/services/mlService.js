import api from "./api";

export const getMLStatus = async () => {
    const response = await api.get("waste-records/ml-status/");
    return response.data;
};

export const trainModels = async () => {
    const response = await api.post("waste-records/train-models/");
    return response.data;
};

export const getMLDataset = async () => {
    const response = await api.get("waste-records/ml-dataset/");
    return response.data;
};