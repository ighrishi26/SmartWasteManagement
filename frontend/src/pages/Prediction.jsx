import { useState } from "react";
import {
    BrainCircuit,
    Calculator,
    CheckCircle2,
    CloudRain,
    Loader2,
    MapPin,
    Thermometer,
    Users,
    CalendarDays,
    Sparkles,
    ShieldAlert,
} from "lucide-react";
import { predictWaste } from "../services/predictionService";
import { useAuth } from "../context/AuthContext";

function Prediction() {
    const { hasPermission } = useAuth();

    const [formData, setFormData] = useState({
        day: "Monday",
        location: "",
        waste_type: "Organic",
        holiday: false,
        special_event: false,
        footfall: "",
        temperature: "",
        rainfall: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.location.trim()) {
            setError("Please enter a location.");
            return;
        }

        if (
            formData.footfall === "" ||
            formData.temperature === "" ||
            formData.rainfall === ""
        ) {
            setError("Please fill in all numeric fields.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await predictWaste({
                ...formData,
                location: formData.location.trim(),
                footfall: Number(formData.footfall),
                temperature: Number(formData.temperature),
                rainfall: Number(formData.rainfall),
            });

            setResult(data);
        } catch (requestError) {
            setError(
                requestError.response?.data?.error ||
                    "Unable to generate prediction."
            );
        } finally {
            setLoading(false);
        }
    };

    const getPriorityClass = (priority) => {
        if (priority === "High") {
            return "prediction-priority-high";
        }

        if (priority === "Medium") {
            return "prediction-priority-medium";
        }

        return "prediction-priority-low";
    };

    if (!hasPermission("prediction")) {
        return (
            <div className="prediction-page">
                <div className="prediction-access-denied">
                    <div className="prediction-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to use
                        the Waste Prediction module.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                <div>
                    <div className="prediction-breadcrumb">
                        Dashboard / Waste Prediction
                    </div>

                    <div className="prediction-title-row">
                        <div className="prediction-title-icon">
                            <BrainCircuit size={24} />
                        </div>

                        <div>
                            <h1>Waste Prediction</h1>
                            <p>
                                Predict future waste generation using the
                                trained machine learning model.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="prediction-alert prediction-alert-error">
                    {error}
                </div>
            )}

            <div className="prediction-layout">
                <div className="prediction-form-card">
                    <div className="prediction-card-header">
                        <div>
                            <h2>Prediction Inputs</h2>
                            <p>
                                Enter the expected conditions for the
                                prediction.
                            </p>
                        </div>

                        <Calculator size={22} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="prediction-form-grid">
                            <div className="prediction-field">
                                <label>
                                    <CalendarDays size={16} />
                                    Day
                                </label>

                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleChange}
                                >
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                </select>
                            </div>

                            <div className="prediction-field">
                                <label>
                                    <MapPin size={16} />
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Main Campus"
                                />
                            </div>

                            <div className="prediction-field">
                                <label>Waste Type</label>

                                <select
                                    name="waste_type"
                                    value={formData.waste_type}
                                    onChange={handleChange}
                                >
                                    <option>Organic</option>
                                    <option>Plastic</option>
                                    <option>Paper</option>
                                    <option>Glass</option>
                                    <option>Metal</option>
                                    <option>E-Waste</option>
                                    <option>Mixed</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="prediction-field">
                                <label>
                                    <Users size={16} />
                                    Expected Footfall
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={formData.footfall}
                                    name="footfall"
                                    onChange={handleChange}
                                    placeholder="e.g. 800"
                                />
                            </div>

                            <div className="prediction-field">
                                <label>
                                    <Thermometer size={16} />
                                    Temperature (°C)
                                </label>

                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.temperature}
                                    name="temperature"
                                    onChange={handleChange}
                                    placeholder="e.g. 28"
                                />
                            </div>

                            <div className="prediction-field">
                                <label>
                                    <CloudRain size={16} />
                                    Rainfall (mm)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.rainfall}
                                    name="rainfall"
                                    onChange={handleChange}
                                    placeholder="e.g. 2.5"
                                />
                            </div>
                        </div>

                        <div className="prediction-options">
                            <label className="prediction-checkbox">
                                <input
                                    type="checkbox"
                                    name="holiday"
                                    checked={formData.holiday}
                                    onChange={handleChange}
                                />

                                <span>
                                    <strong>Holiday</strong>
                                    <small>
                                        Mark if the selected day is a
                                        holiday.
                                    </small>
                                </span>
                            </label>

                            <label className="prediction-checkbox">
                                <input
                                    type="checkbox"
                                    name="special_event"
                                    checked={formData.special_event}
                                    onChange={handleChange}
                                />

                                <span>
                                    <strong>Special Event</strong>
                                    <small>
                                        Mark if an event is expected.
                                    </small>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="prediction-submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="prediction-spinner"
                                    />
                                    Generating Prediction...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate Prediction
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="prediction-result-card">
                    <div className="prediction-card-header">
                        <div>
                            <h2>Prediction Result</h2>
                            <p>
                                ML-generated waste estimation and collection
                                priority.
                            </p>
                        </div>

                        <BrainCircuit size={22} />
                    </div>

                    {!result ? (
                        <div className="prediction-empty">
                            <div className="prediction-empty-icon">
                                <BrainCircuit size={30} />
                            </div>

                            <h3>No Prediction Yet</h3>

                            <p>
                                Enter the required information and generate a
                                prediction to see the estimated waste quantity.
                            </p>
                        </div>
                    ) : (
                        <div className="prediction-result-content">
                            <div className="prediction-main-result">
                                <span>Predicted Waste</span>

                                <strong>
                                    {result.predicted_waste_kg}
                                    <small> kg</small>
                                </strong>

                                <div className="prediction-result-status">
                                    <CheckCircle2 size={16} />
                                    Prediction generated successfully
                                </div>
                            </div>

                            <div
                                className={`prediction-priority ${getPriorityClass(
                                    result.collection_priority
                                )}`}
                            >
                                <span>Collection Priority</span>

                                <strong>
                                    {result.collection_priority}
                                </strong>

                                <small>
                                    {result.priority_label}
                                </small>
                            </div>

                            <div className="prediction-model-info">
                                <span>Model Used</span>
                                <strong>
                                    {result.model_name}
                                </strong>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Prediction;