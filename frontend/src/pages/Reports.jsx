import { useState } from "react";
import {
    FileText,
    Download,
    Database,
    BarChart3,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
} from "lucide-react";

import { downloadWasteReport } from "../services/reportService";
import { useAuth } from "../context/AuthContext";

function Reports() {
    const { hasPermission } = useAuth();

    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setSuccess("");
            setError("");

            await downloadWasteReport();

            setSuccess(
                "Waste report downloaded successfully."
            );
        } catch (err) {
            console.error(err);
            setError(
                "Unable to generate the waste report."
            );
        } finally {
            setDownloading(false);
        }
    };

    if (!hasPermission("reports")) {
        return (
            <div className="reports-page">
                <div className="reports-access-denied">
                    <div className="reports-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to use
                        the Reports module.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <span className="reports-eyebrow">
                        REPORT MANAGEMENT
                    </span>

                    <h1>Reports</h1>

                    <p>
                        Generate and download reports from your
                        Smart Waste Management data.
                    </p>
                </div>
            </div>

            {success && (
                <div className="reports-success">
                    <CheckCircle2 size={18} />
                    {success}
                </div>
            )}

            {error && (
                <div className="reports-error">
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            <div className="reports-grid">
                <div className="report-card">
                    <div className="report-card-icon">
                        <FileText size={24} />
                    </div>

                    <div className="report-card-content">
                        <span className="report-card-label">
                            WASTE DATA REPORT
                        </span>

                        <h2>Waste Records Report</h2>

                        <p>
                            Download all recorded waste data including
                            locations, waste types, quantities,
                            footfall, weather conditions and events.
                        </p>

                        <div className="report-features">
                            <div>
                                <Database size={15} />
                                Complete waste records
                            </div>

                            <div>
                                <BarChart3 size={15} />
                                Environmental factors
                            </div>

                            <div>
                                <FileText size={15} />
                                CSV format
                            </div>
                        </div>

                        {hasPermission("reports") && (
                            <button
                                className="report-download-button"
                                onClick={handleDownload}
                                disabled={downloading}
                            >
                                <Download size={17} />

                                {downloading
                                    ? "Generating Report..."
                                    : "Download CSV Report"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;