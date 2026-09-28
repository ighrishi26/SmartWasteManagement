import { useEffect, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Activity,
    MapPin,
    CalendarDays,
    Recycle,
    ShieldAlert,
} from "lucide-react";
import { getAnomalies } from "../services/anomalyService";
import { useAuth } from "../context/AuthContext";

function Anomalies() {
    const { hasPermission } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadAnomalies = async () => {
        try {
            setError("");

            const response = await getAnomalies();

            setData(response);
        } catch (requestError) {
            setError(
                requestError.response?.data?.error ||
                    "Unable to load anomaly data."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeAnomalies = async () => {
            try {
                setError("");
                const response = await getAnomalies();

                if (isMounted) {
                    setData(response);
                }
            } catch (requestError) {
                if (isMounted) {
                    setError(
                        requestError.response?.data?.error ||
                            "Unable to load anomaly data."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        };

        void initializeAnomalies();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAnomalies();
    };

    if (!hasPermission("anomalies")) {
        return (
            <div className="anomalies-page">
                <div className="anomalies-access-denied">
                    <div className="anomalies-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to use
                        the Anomaly Detection module.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="anomalies-page">
                <div className="anomalies-loading">
                    <RefreshCw
                        size={24}
                        className="anomalies-spinner"
                    />
                    <span>Analyzing waste records...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="anomalies-page">
            <div className="anomalies-header">
                <div>
                    <div className="anomalies-breadcrumb">
                        Dashboard / Anomalies
                    </div>

                    <div className="anomalies-title-row">
                        <div className="anomalies-title-icon">
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h1>Anomaly Detection</h1>
                            <p>
                                Identify unusual waste observations using
                                machine learning.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="anomalies-refresh-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "anomalies-spinner"
                                : ""
                        }
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="anomalies-error">
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="anomalies-stat-grid">
                        <div className="anomalies-stat-card">
                            <div className="anomalies-stat-icon total">
                                <Activity size={20} />
                            </div>

                            <div>
                                <span>Total Records</span>
                                <strong>{data.total_records}</strong>
                            </div>
                        </div>

                        <div className="anomalies-stat-card">
                            <div className="anomalies-stat-icon warning">
                                <AlertTriangle size={20} />
                            </div>

                            <div>
                                <span>Anomalies Detected</span>
                                <strong>{data.anomaly_count}</strong>
                            </div>
                        </div>

                        <div className="anomalies-stat-card">
                            <div className="anomalies-stat-icon normal">
                                <CheckCircle2 size={20} />
                            </div>

                            <div>
                                <span>Normal Records</span>
                                <strong>{data.normal_count}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="anomalies-info-card">
                        <div className="anomalies-info-icon">
                            <Activity size={20} />
                        </div>

                        <div>
                            <strong>How anomaly detection works</strong>
                            <p>
                                Isolation Forest identifies observations
                                that differ from the overall patterns in
                                waste quantity, footfall, temperature,
                                rainfall, holidays, and special events.
                            </p>
                            <small>
                                An anomaly indicates an unusual observation;
                                it does not prove the reason or cause of the
                                unusual waste generation.
                            </small>
                        </div>
                    </div>

                    <div className="anomalies-table-card">
                        <div className="anomalies-card-header">
                            <div>
                                <h2>Detected Anomalies</h2>
                                <p>
                                    Unusual observations identified by the
                                    Isolation Forest model.
                                </p>
                            </div>

                            <AlertTriangle size={21} />
                        </div>

                        {data.anomalies.length === 0 ? (
                            <div className="anomalies-empty">
                                <CheckCircle2 size={30} />
                                <h3>No anomalies detected</h3>
                                <p>
                                    The current dataset does not contain
                                    observations classified as unusual.
                                </p>
                            </div>
                        ) : (
                            <div className="anomalies-table-wrapper">
                                <table className="anomalies-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Location</th>
                                            <th>Waste Type</th>
                                            <th>Waste</th>
                                            <th>Footfall</th>
                                            <th>Conditions</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.anomalies.map((record) => (
                                            <tr key={record.id}>
                                                <td>
                                                    <div className="anomalies-date">
                                                        <CalendarDays size={15} />
                                                        {record.date}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="anomalies-location">
                                                        <MapPin size={15} />
                                                        {record.location}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="anomalies-waste-type">
                                                        <Recycle size={15} />
                                                        {record.waste_type}
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {record.quantity_kg} kg
                                                    </strong>
                                                </td>

                                                <td>
                                                    {record.footfall}
                                                </td>

                                                <td>
                                                    <div className="anomalies-conditions">
                                                        <span>
                                                            {record.temperature}°C
                                                        </span>
                                                        <span>
                                                            {record.rainfall} mm
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="anomalies-status">
                                                        <AlertTriangle
                                                            size={14}
                                                        />
                                                        Anomaly
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Anomalies;