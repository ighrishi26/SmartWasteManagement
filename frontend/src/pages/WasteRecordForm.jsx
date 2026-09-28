import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Save,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createWasteRecord,
    getWasteRecord,
    updateWasteRecord,
} from "../services/wasteService";

import { useAuth } from "../context/AuthContext";
import AccessDenied from "./AccessDenied";

function WasteRecordForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { hasPermission } = useAuth();
    const canEdit = hasPermission("waste_records_edit");
    const canCreate = hasPermission("waste_records_create");

    const isEditMode = Boolean(id);

    const hasAccess = isEditMode
        ? hasPermission("waste_records_edit")
        : hasPermission("waste_records_create");

    const [formData, setFormData] = useState({
        date: "",
        location: "",
        waste_type: "Organic",
        quantity_kg: "",
        day: "",
        holiday: false,
        special_event: false,
        footfall: "",
        temperature: "",
        rainfall: "",
    });

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(
        isEditMode && hasAccess
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isEditMode || !hasAccess) {
            return;
        }

        const loadRecord = async () => {
            try {
                setPageLoading(true);
                setError("");

                const data = await getWasteRecord(id);

                setFormData({
                    date: data.date || "",
                    location: data.location || "",
                    waste_type:
                        data.waste_type || "Organic",
                    quantity_kg:
                        data.quantity_kg ?? "",
                    day: data.day || "",
                    holiday: Boolean(data.holiday),
                    special_event:
                        Boolean(data.special_event),
                    footfall: data.footfall ?? "",
                    temperature:
                        data.temperature ?? "",
                    rainfall: data.rainfall ?? "",
                });
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load the waste record."
                );
            } finally {
                setPageLoading(false);
            }
        };

        loadRecord();
    }, [id, isEditMode, hasAccess]);

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleDateChange = (event) => {
        const date = event.target.value;

        setFormData((previous) => ({
            ...previous,
            date,
            day: date
                ? new Date(
                      `${date}T00:00:00`
                  ).toLocaleDateString("en-US", {
                      weekday: "long",
                  })
                : "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.date) {
            setError("Please select a date.");
            return;
        }

        if (!formData.location.trim()) {
            setError("Please enter a location.");
            return;
        }

        if (
            !formData.quantity_kg ||
            Number(formData.quantity_kg) <= 0
        ) {
            setError(
                "Quantity must be greater than 0 kg."
            );
            return;
        }

        if (
            formData.footfall !== "" &&
            Number(formData.footfall) < 0
        ) {
            setError(
                "Footfall cannot be negative."
            );
            return;
        }

        if (
            formData.temperature !== "" &&
            (Number(formData.temperature) < -50 ||
                Number(formData.temperature) > 70)
        ) {
            setError(
                "Temperature must be between -50°C and 70°C."
            );
            return;
        }

        if (
            formData.rainfall !== "" &&
            Number(formData.rainfall) < 0
        ) {
            setError(
                "Rainfall cannot be negative."
            );
            return;
        }

        const payload = {
            date: formData.date,
            location: formData.location.trim(),
            waste_type: formData.waste_type,
            quantity_kg: Number(
                formData.quantity_kg
            ),
            day: formData.day,
            holiday: formData.holiday,
            special_event:
                formData.special_event,
            footfall:
                formData.footfall === ""
                    ? 0
                    : Number(formData.footfall),
            temperature:
                formData.temperature === ""
                    ? null
                    : Number(formData.temperature),
            rainfall:
                formData.rainfall === ""
                    ? null
                    : Number(formData.rainfall),
        };

        try {
            setLoading(true);

            if (isEditMode) {
                await updateWasteRecord(
                    id,
                    payload
                );

                setSuccess(
                    "Waste record updated successfully."
                );
            } else {
                await createWasteRecord(payload);

                setSuccess(
                    "Waste record created successfully."
                );
            }

            setTimeout(() => {
                navigate("/waste-records");
            }, 700);
        } catch (err) {
            console.error(err);

            const backendError =
                err?.response?.data;

            if (
                backendError &&
                typeof backendError === "object"
            ) {
                const messages = Object.entries(
                    backendError
                )
                    .map(
                        ([field, message]) =>
                            `${field}: ${
                                Array.isArray(
                                    message
                                )
                                    ? message.join(
                                          ", "
                                      )
                                    : message
                            }`
                    )
                    .join(" | ");

                setError(
                    messages ||
                        "Unable to save the record."
                );
            } else {
                setError(
                    "Unable to save the waste record. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!hasAccess) {
        return (
            <div className="waste-form-page">
                <div className="form-access-denied">
                    <div className="form-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to{" "}
                        {isEditMode
                            ? "edit"
                            : "create"}{" "}
                        waste records.
                    </p>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/waste-records")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Records
                    </button>
                </div>
            </div>
        );
    }

    if (pageLoading) {
        return (
            <div className="form-state">
                <RefreshCw
                    size={25}
                    className="loading-icon"
                />
                <p>Loading waste record...</p>
            </div>
        );
    }

    if (id && !canEdit) {
    return <AccessDenied />;
}

if (!id && !canCreate) {
    return <AccessDenied />;
}

    return (
        <div className="waste-form-page">
            <div className="form-page-header">
                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/waste-records")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Records
                </button>

                <div>
                    <h2>
                        {isEditMode
                            ? "Edit Waste Record"
                            : "Add Waste Record"}
                    </h2>

                    <p>
                        {isEditMode
                            ? "Update the selected waste collection record."
                            : "Enter the details of a new waste collection record."}
                    </p>
                </div>
            </div>

            {error && (
                <div className="form-alert error">
                    {error}
                </div>
            )}

            {success && (
                <div className="form-alert success">
                    {success}
                </div>
            )}

            <form
                className="waste-form-card"
                onSubmit={handleSubmit}
            >
                <div className="form-section">
                    <div className="form-section-heading">
                        <h3>Waste Information</h3>
                        <p>
                            Basic details about the waste
                            collection.
                        </p>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                Date{" "}
                                <span>*</span>
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={
                                    formData.date
                                }
                                onChange={
                                    handleDateChange
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Day</label>

                            <input
                                type="text"
                                value={
                                    formData.day
                                }
                                readOnly
                                placeholder="Automatically calculated"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Location{" "}
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Main Campus"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Waste Type{" "}
                                <span>*</span>
                            </label>

                            <select
                                name="waste_type"
                                value={
                                    formData.waste_type
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="Organic">
                                    Organic
                                </option>
                                <option value="Plastic">
                                    Plastic
                                </option>
                                <option value="Paper">
                                    Paper
                                </option>
                                <option value="Glass">
                                    Glass
                                </option>
                                <option value="Metal">
                                    Metal
                                </option>
                                <option value="E-Waste">
                                    E-Waste
                                </option>
                                <option value="Mixed">
                                    Mixed
                                </option>
                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Quantity (kg){" "}
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="quantity_kg"
                                value={
                                    formData.quantity_kg
                                }
                                onChange={
                                    handleChange
                                }
                                min="0.01"
                                step="0.01"
                                placeholder="e.g. 125.50"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-section-heading">
                        <h3>Collection Context</h3>
                        <p>
                            Additional factors that may
                            affect waste generation.
                        </p>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Footfall</label>

                            <input
                                type="number"
                                name="footfall"
                                value={
                                    formData.footfall
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                placeholder="Number of people"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Temperature (°C)
                            </label>

                            <input
                                type="number"
                                name="temperature"
                                value={
                                    formData.temperature
                                }
                                onChange={
                                    handleChange
                                }
                                min="-50"
                                max="70"
                                step="0.1"
                                placeholder="e.g. 28.5"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Rainfall (mm)
                            </label>

                            <input
                                type="number"
                                name="rainfall"
                                value={
                                    formData.rainfall
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.1"
                                placeholder="e.g. 2.5"
                            />
                        </div>
                    </div>

                    <div className="checkbox-grid">
                        <label className="checkbox-card">
                            <input
                                type="checkbox"
                                name="holiday"
                                checked={
                                    formData.holiday
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div>
                                <strong>
                                    Holiday
                                </strong>

                                <span>
                                    Mark if this record
                                    belongs to a holiday.
                                </span>
                            </div>
                        </label>

                        <label className="checkbox-card">
                            <input
                                type="checkbox"
                                name="special_event"
                                checked={
                                    formData.special_event
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div>
                                <strong>
                                    Special Event
                                </strong>

                                <span>
                                    Mark if an event may
                                    have affected waste
                                    generation.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(
                                "/waste-records"
                            )
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <RefreshCw
                                    size={17}
                                    className="loading-icon"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                {isEditMode
                                    ? "Update Record"
                                    : "Save Record"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default WasteRecordForm;