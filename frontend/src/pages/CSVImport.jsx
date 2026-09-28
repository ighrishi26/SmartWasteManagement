import { useState } from "react";
import {
    Upload,
    Download,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    FileCheck2,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "./AccessDenied";

function CSVImport() {
    const { hasPermission } = useAuth();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleImport = async () => {
        if (!file) {
            setError("Please select a CSV file first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post(
                "waste-records/import-csv/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResult(response.data);
            setFile(null);
        } catch {
            setError("Unable to import the CSV file.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setError("");

            const response = await api.get(
                "waste-records/export-csv/",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = url;
            link.download = "smart-waste-records.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch {
            setError("Unable to export waste records.");
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setError("");
        setResult(null);
    };

    if (!hasPermission("csv_import")) {
    return <AccessDenied />;
}

    return (
        <div className="csv-page">
            <div className="csv-page-header">
                <div>
                    <div className="csv-breadcrumb">
                        Waste Management <span>/</span> Data Tools
                    </div>

                    <h1>CSV Import & Export</h1>

                    <p>
                        Manage waste records efficiently using CSV files.
                    </p>
                </div>
            </div>

            <div className="csv-content-grid">
                <div className="csv-main-card">
                    <div className="csv-card-top">
                        <div className="csv-card-icon">
                            <Upload size={22} />
                        </div>

                        <div>
                            <h2>Import Waste Data</h2>
                            <p>
                                Upload a CSV file to add waste records to
                                the system.
                            </p>
                        </div>
                    </div>

                    <div className="csv-upload-area">
                        <input
                            id="csv-file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            hidden
                        />

                        <label
                            htmlFor="csv-file"
                            className="csv-upload-label"
                        >
                            <div className="csv-upload-icon">
                                <FileSpreadsheet size={28} />
                            </div>

                            <h3>
                                {file
                                    ? file.name
                                    : "Choose a CSV file"}
                            </h3>

                            <p>
                                {file
                                    ? `${(
                                          file.size / 1024
                                      ).toFixed(1)} KB selected`
                                    : "Click here to browse your files"}
                            </p>

                            {!file && (
                                <span className="csv-file-hint">
                                    Supported format: .CSV
                                </span>
                            )}
                        </label>
                    </div>

                    <div className="csv-import-footer">
                        <div className="csv-validation-note">
                            <FileCheck2 size={17} />

                            <span>
                                Your data will be validated before import.
                            </span>
                        </div>

                        <button
                            className="csv-primary-button"
                            onClick={handleImport}
                            disabled={!file || loading}
                        >
                            <Upload size={17} />

                            {loading
                                ? "Importing..."
                                : "Import CSV"}
                        </button>
                    </div>
                </div>

                <div className="csv-export-card">
                    <div className="csv-export-icon">
                        <Download size={23} />
                    </div>

                    <h2>Export Data</h2>

                    <p>
                        Download all currently stored waste records as
                        a CSV file.
                    </p>

                    <div className="csv-export-info">
                        <div>
                            <FileSpreadsheet size={18} />
                            <span>CSV format</span>
                        </div>

                        <div>
                            <CheckCircle2 size={18} />
                            <span>All records included</span>
                        </div>
                    </div>

                    <button
                        className="csv-secondary-button"
                        onClick={handleExport}
                    >
                        <Download size={17} />
                        Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="csv-message csv-error">
                    <AlertCircle size={20} />

                    <div>
                        <strong>Import Error</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {result && (
                <div className="csv-result-card">
                    <div className="csv-result-header">
                        <div className="csv-success-icon">
                            <CheckCircle2 size={21} />
                        </div>

                        <div>
                            <h2>Import Completed</h2>

                            <p>
                                Your CSV file has been processed
                                successfully.
                            </p>
                        </div>
                    </div>

                    <div className="csv-summary-grid">
                        <div className="csv-summary-item">
                            <strong>
                                {result.summary.total_rows}
                            </strong>

                            <span>Total Rows</span>
                        </div>

                        <div className="csv-summary-item">
                            <strong>
                                {result.summary.valid_rows}
                            </strong>

                            <span>Valid Rows</span>
                        </div>

                        <div className="csv-summary-item">
                            <strong>
                                {result.summary.invalid_rows}
                            </strong>

                            <span>Invalid Rows</span>
                        </div>

                        <div className="csv-summary-item">
                            <strong>
                                {result.summary.duplicate_rows}
                            </strong>

                            <span>Duplicates</span>
                        </div>

                        <div className="csv-summary-item csv-imported">
                            <strong>
                                {result.summary.imported}
                            </strong>

                            <span>Imported</span>
                        </div>
                    </div>

                    {result.invalid_details?.length > 0 && (
                        <div className="csv-invalid-section">
                            <h3>Invalid Rows</h3>

                            <div className="csv-invalid-list">
                                {result.invalid_details.map(
                                    (item, index) => (
                                        <div
                                            className="csv-invalid-row"
                                            key={index}
                                        >
                                            <strong>
                                                Row {item.row}
                                            </strong>

                                            <span>
                                                {item.errors.join(", ")}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CSVImport;