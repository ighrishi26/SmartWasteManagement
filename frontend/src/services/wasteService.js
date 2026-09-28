import api from "./api";

export const getWasteRecords = async (params = {}) => {
    const response = await api.get("waste-records/", {
        params,
    });

    return response.data;
};

export const getWasteRecord = async (id) => {
    const response = await api.get(`waste-records/${id}/`);

    return response.data;
};

export const createWasteRecord = async (data) => {
    const response = await api.post(
        "waste-records/",
        data
    );

    return response.data;
};

export const updateWasteRecord = async (id, data) => {
    const response = await api.put(
        `waste-records/${id}/`,
        data
    );

    return response.data;
};

export const deleteWasteRecord = async (id) => {
    const response = await api.delete(
        `waste-records/${id}/`
    );

    return response.data;
};