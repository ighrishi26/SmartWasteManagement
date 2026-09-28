import { useEffect, useState } from "react";
import {
    BrainCircuit,
    Database,
    RefreshCw,
    Play,
    CheckCircle2,
    Clock3,
    Target,
    BarChart3,
    MapPin,
    Trash2,
    CalendarDays,
} from "lucide-react";

import {
    getMLStatus,
    trainModels,
    getMLDataset,
} from "../services/mlService";

import { useAuth } from "../context/AuthContext";
import AccessDenied from "./AccessDenied";

function MLModels() {
    const { hasPermission } = useAuth();

    const [status, setStatus] = useState(null);
    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [statusData, datasetData] = await Promise.all([
                getMLStatus(),
                getMLDataset(),
            ]);

            setStatus(statusData);
            setDataset(datasetData);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load ML model information. Please check the backend server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [statusData, datasetData] = await Promise.all([
                    getMLStatus(),
                    getMLDataset(),
                ]);

                if (!isMounted) return;

                setStatus(statusData);
                setDataset(datasetData);
            } catch (err) {
                console.error(err);

                if (!isMounted) return;

                setError(
                    "Unable to load ML model information. Please check the backend server."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleTrainModels = async () => {
        try {
            setTraining(true);
            setError("");
            setMessage("");

            const result = await trainModels();

            if (!result.success) {
                setError(result.error || "Model training failed.");
                return;
            }

            setMessage(
                `Training completed successfully. Selected model: ${result.best_model}`
            );

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Model training failed. Please try again."
            );
        } finally {
            setTraining(false);
        }
    };

    if (!hasPermission("ml_models")) {
    return <AccessDenied />;
}

    if (loading) {
        return (
            <div className="ml-loading-page">
                <RefreshCw size={22} className="spin" />
                <span>Loading machine learning information...</span>
            </div>
        );
    }

    const metrics = status?.metrics;
    const models = metrics?.models || [];

    return (
        <div className="ml-page">
            <div className="ml-page-header">
                <div className="ml-header-content">
                    <div className="ml-header-icon">
                        <BrainCircuit size={25} />
                    </div>

                    <div>
                        <span className="ml-eyebrow">
                            MACHINE LEARNING
                        </span>

                        <h1>ML Models</h1>

                        <p>
                            Train and compare machine learning models
                            for waste generation prediction.
                        </p>
                    </div>
                </div>

                <div className="ml-header-actions">
                    <button
                        className="ml-refresh-button"
                        onClick={loadData}
                        disabled={training}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                    <button
                        className="ml-train-button"
                        onClick={handleTrainModels}
                        disabled={training}
                    >
                        {training ? (
                            <>
                                <RefreshCw
                                    size={17}
                                    className="spin"
                                />
                                Training...
                            </>
                        ) : (
                            <>
                                <Play size={17} />
                                Train Models
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="ml-alert ml-alert-error">
                    <span>{error}</span>
                </div>
            )}

            {message && (
                <div className="ml-alert ml-alert-success">
                    <CheckCircle2 size={18} />
                    <span>{message}</span>
                </div>
            )}

            <div className="ml-status-grid">
                <div className="ml-status-card">
                    <div className="ml-status-icon">
                        <Database size={21} />
                    </div>

                    <div className="ml-status-content">
                        <span>Dataset Records</span>

                        <strong>
                            {dataset?.total_records ?? 0}
                        </strong>

                        <small>Total available records</small>
                    </div>
                </div>

                <div className="ml-status-card">
                    <div className="ml-status-icon">
                        <CheckCircle2 size={21} />
                    </div>

                    <div className="ml-status-content">
                        <span>Usable Records</span>

                        <strong>
                            {dataset?.usable_records ?? 0}
                        </strong>

                        <small>Ready for training</small>
                    </div>
                </div>

                <div className="ml-status-card">
                    <div className="ml-status-icon">
                        <BrainCircuit size={21} />
                    </div>

                    <div className="ml-status-content">
                        <span>Model Status</span>

                        <strong className="ml-status-value">
                            <span
                                className={
                                    status?.trained
                                        ? "ml-status-dot active"
                                        : "ml-status-dot"
                                }
                            />

                            {status?.trained
                                ? "Trained"
                                : "Not Trained"}
                        </strong>

                        <small>Current training state</small>
                    </div>
                </div>

                <div className="ml-status-card">
                    <div className="ml-status-icon">
                        <Target size={21} />
                    </div>

                    <div className="ml-status-content">
                        <span>Selected Model</span>

                        <strong className="ml-model-value">
                            {metrics?.best_model || "None"}
                        </strong>

                        <small>Saved for prediction</small>
                    </div>
                </div>
            </div>

            <section className="ml-section-card">
                <div className="ml-section-header">
                    <div>
                        <h2>Training Dataset</h2>

                        <p>
                            Overview of the data currently available
                            for machine learning.
                        </p>
                    </div>

                    <div className="ml-section-badge">
                        <Database size={15} />
                        Dataset
                    </div>
                </div>

                <div className="ml-dataset-grid">
                    <div className="ml-dataset-item">
                        <div className="ml-dataset-item-icon">
                            <Database size={18} />
                        </div>

                        <div>
                            <span>Records</span>

                            <strong>
                                {dataset?.total_records ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="ml-dataset-item">
                        <div className="ml-dataset-item-icon">
                            <MapPin size={18} />
                        </div>

                        <div>
                            <span>Locations</span>

                            <strong>
                                {dataset?.locations ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="ml-dataset-item">
                        <div className="ml-dataset-item-icon">
                            <Trash2 size={18} />
                        </div>

                        <div>
                            <span>Waste Types</span>

                            <strong>
                                {dataset?.waste_types ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="ml-dataset-item">
                        <div className="ml-dataset-item-icon">
                            <CalendarDays size={18} />
                        </div>

                        <div>
                            <span>Date Range</span>

                            <strong className="ml-date-value">
                                {dataset?.date_from || "—"}
                                {" → "}
                                {dataset?.date_to || "—"}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ml-section-card">
                <div className="ml-section-header">
                    <div>
                        <h2>Model Comparison</h2>

                        <p>
                            Performance comparison using the test dataset.
                        </p>
                    </div>

                    {models.length > 0 && (
                        <div className="ml-model-count">
                            {models.length} Models
                        </div>
                    )}
                </div>

                {!models.length ? (
                    <div className="ml-empty-state">
                        <div className="ml-empty-icon">
                            <BrainCircuit size={30} />
                        </div>

                        <h3>No trained models yet</h3>

                        <p>
                            Train the available regression models to
                            compare their prediction performance.
                        </p>

                        <button
                            className="ml-empty-button"
                            onClick={handleTrainModels}
                            disabled={training}
                        >
                            <Play size={16} />
                            Train Models
                        </button>
                    </div>
                ) : (
                    <div className="ml-table-wrapper">
                        <table className="ml-model-table">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>MAE</th>
                                    <th>RMSE</th>
                                    <th>R² Score</th>
                                    <th>Training Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {models.map((model) => {
                                    const isBest =
                                        model.model ===
                                        metrics.best_model;

                                    return (
                                        <tr
                                            key={model.model}
                                            className={
                                                isBest
                                                    ? "ml-best-model-row"
                                                    : ""
                                            }
                                        >
                                            <td>
                                                <div className="ml-table-model">
                                                    <div className="ml-table-model-icon">
                                                        <BrainCircuit
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {model.model}
                                                        </strong>

                                                        {isBest && (
                                                            <span className="ml-selected-badge">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="ml-metric-value">
                                                    {model.mae}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="ml-metric-value">
                                                    {model.rmse}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="ml-r2-value">
                                                    {model.r2}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="ml-time-value">
                                                    <Clock3 size={15} />

                                                    {
                                                        model.training_time_seconds
                                                    }{" "}
                                                    sec
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {metrics?.best_model_metrics && (
                <section className="ml-selected-card">
                    <div className="ml-selected-header">
                        <div className="ml-selected-icon">
                            <BarChart3 size={25} />
                        </div>

                        <div>
                            <span>SELECTED MODEL</span>

                            <h2>{metrics.best_model}</h2>

                            <p>
                                This model is currently saved and will
                                be used for future waste predictions.
                            </p>
                        </div>
                    </div>

                    <div className="ml-selected-metrics">
                        <div>
                            <span>MAE</span>

                            <strong>
                                {metrics.best_model_metrics.mae}
                            </strong>
                        </div>

                        <div>
                            <span>RMSE</span>

                            <strong>
                                {metrics.best_model_metrics.rmse}
                            </strong>
                        </div>

                        <div>
                            <span>R² SCORE</span>

                            <strong>
                                {metrics.best_model_metrics.r2}
                            </strong>
                        </div>

                        <div>
                            <span>TRAINING TIME</span>

                            <strong>
                                {
                                    metrics.best_model_metrics
                                        .training_time_seconds
                                }{" "}
                                sec
                            </strong>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default MLModels;