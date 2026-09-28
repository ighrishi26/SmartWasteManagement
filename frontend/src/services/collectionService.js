import api from "./api";

export const getCollectionPlan = async () => {
    const response = await api.get(
        "waste-records/collection-plan/"
    );

    return response.data;
};