import api from "./api";

export const downloadWasteReport = async () => {
    const response = await api.get(
        "waste-records/report/",
        {
            responseType: "blob",
        }
    );

    const blob = new Blob(
        [response.data],
        { type: "text/csv" }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-waste-report.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};