import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
} from "lucide-react";

import {
    getWasteRecords,
    deleteWasteRecord,
} from "../services/wasteService";

import { useAuth } from "../context/AuthContext";

function WasteRecords() {
    const navigate = useNavigate();

    const {
        hasPermission,
    } = useAuth();

    const canCreate = hasPermission(
        "waste_records_create"
    );

    const canEdit = hasPermission(
        "waste_records_edit"
    );

    const canDelete = hasPermission(
        "waste_records_delete"
    );

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [wasteType, setWasteType] = useState("");
    const [holiday, setHoliday] = useState("");
    const [specialEvent, setSpecialEvent] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedRecord, setSelectedRecord] =
        useState(null);

    const loadRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (wasteType) {
                params.waste_type = wasteType;
            }

            if (holiday) {
                params.holiday = holiday;
            }

            if (specialEvent) {
                params.special_event = specialEvent;
            }

            const data = await getWasteRecords(params);

            setRecords(data.results || []);

            const count = data.count || 0;

            setTotalPages(
                Math.max(1, Math.ceil(count / 10))
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load waste records. Make sure the Django server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchRecords = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    page,
                };

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (wasteType) {
                    params.waste_type = wasteType;
                }

                if (holiday) {
                    params.holiday = holiday;
                }

                if (specialEvent) {
                    params.special_event =
                        specialEvent;
                }

                const data =
                    await getWasteRecords(params);

                if (!isMounted) {
                    return;
                }

                setRecords(data.results || []);

                const count = data.count || 0;

                setTotalPages(
                    Math.max(
                        1,
                        Math.ceil(count / 10)
                    )
                );
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(
                        "Unable to load waste records. Make sure the Django server is running."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchRecords();

        return () => {
            isMounted = false;
        };
    }, [
        page,
        search,
        wasteType,
        holiday,
        specialEvent,
    ]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this waste record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteWasteRecord(id);

            loadRecords();
        } catch (err) {
            console.error(err);

            setError(
                "Unable to delete the waste record."
            );
        }
    };

    const handleView = (record) => {
        setSelectedRecord(record);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <div className="waste-records-page">
            <div className="page-title-row">
                <div>
                    <h2>Waste Records</h2>

                    <p>
                        Manage and monitor collected waste
                        records.
                    </p>
                </div>

                {canCreate && (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/waste-records/add"
                            )
                        }
                    >
                        <Plus size={18} />
                        Add Record
                    </button>
                )}
            </div>

            <div className="filter-card">
                <div className="filter-header">
                    <div>
                        <Filter size={18} />
                        <span>Filters</span>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadRecords}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                <div className="filter-grid">
                    <div className="search-box">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search location or waste type..."
                            value={search}
                            onChange={(e) => {
                                setSearch(
                                    e.target.value
                                );
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        value={wasteType}
                        onChange={(e) => {
                            setWasteType(
                                e.target.value
                            );
                            setPage(1);
                        }}
                    >
                        <option value="">
                            All Waste Types
                        </option>

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

                    <select
                        value={holiday}
                        onChange={(e) => {
                            setHoliday(
                                e.target.value
                            );
                            setPage(1);
                        }}
                    >
                        <option value="">
                            Holiday: All
                        </option>

                        <option value="true">
                            Holiday
                        </option>

                        <option value="false">
                            Normal Day
                        </option>
                    </select>

                    <select
                        value={specialEvent}
                        onChange={(e) => {
                            setSpecialEvent(
                                e.target.value
                            );
                            setPage(1);
                        }}
                    >
                        <option value="">
                            Event: All
                        </option>

                        <option value="true">
                            Special Event
                        </option>

                        <option value="false">
                            Normal
                        </option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="records-card">
                <div className="records-card-header">
                    <div>
                        <h3>All Waste Records</h3>

                        <span>
                            Showing page {page} of{" "}
                            {totalPages}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="state-message">
                        <RefreshCw
                            size={24}
                            className="loading-icon"
                        />

                        <p>
                            Loading records...
                        </p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="state-message">
                        <Trash2 size={28} />

                        <p>
                            No waste records found.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="waste-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Waste Type</th>
                                    <th>Quantity</th>
                                    <th>Footfall</th>
                                    <th>Holiday</th>
                                    <th>Event</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record.id
                                            }
                                        >
                                            <td>
                                                {formatDate(
                                                    record.date
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        record.location
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="waste-type-badge">
                                                    {
                                                        record.waste_type
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {Number(
                                                        record.quantity_kg
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    kg
                                                </strong>
                                            </td>

                                            <td>
                                                {record.footfall?.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        record.holiday
                                                            ? "status-badge yes"
                                                            : "status-badge no"
                                                    }
                                                >
                                                    {record.holiday
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        record.special_event
                                                            ? "status-badge yes"
                                                            : "status-badge no"
                                                    }
                                                >
                                                    {record.special_event
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="icon-button view"
                                                        title="View"
                                                        onClick={() =>
                                                            handleView(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    {canEdit && (
                                                        <button
                                                            className="icon-button edit"
                                                            title="Edit"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/waste-records/edit/${record.id}`
                                                                )
                                                            }
                                                        >
                                                            <Pencil
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            className="icon-button delete"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    record.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading &&
                    records.length > 0 && (
                        <div className="pagination">
                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                            >
                                <ChevronLeft size={17} />
                                Previous
                            </button>

                            <span>
                                Page {page} of{" "}
                                {totalPages}
                            </span>

                            <button
                                disabled={
                                    page ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >
                                Next
                                <ChevronRight
                                    size={17}
                                />
                            </button>
                        </div>
                    )}
            </div>

            {selectedRecord && (
                <div
                    className="record-modal-overlay"
                    onClick={() =>
                        setSelectedRecord(null)
                    }
                >
                    <div
                        className="record-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="record-modal-header">
                            <div>
                                <h3>
                                    Waste Record Details
                                </h3>

                                <p>
                                    Record #
                                    {selectedRecord.id}
                                </p>
                            </div>

                            <button
                                className="modal-close-button"
                                onClick={() =>
                                    setSelectedRecord(
                                        null
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="record-details-grid">
                            <div className="record-detail">
                                <span>Date</span>
                                <strong>
                                    {formatDate(
                                        selectedRecord.date
                                    )}
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Location</span>
                                <strong>
                                    {
                                        selectedRecord.location
                                    }
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Waste Type</span>
                                <strong>
                                    {
                                        selectedRecord.waste_type
                                    }
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Quantity</span>
                                <strong>
                                    {Number(
                                        selectedRecord.quantity_kg
                                    ).toFixed(2)}{" "}
                                    kg
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Footfall</span>
                                <strong>
                                    {selectedRecord.footfall?.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Day</span>
                                <strong>
                                    {selectedRecord.day ||
                                        "-"}
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Holiday</span>
                                <strong>
                                    {selectedRecord.holiday
                                        ? "Yes"
                                        : "No"}
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Special Event</span>
                                <strong>
                                    {selectedRecord.special_event
                                        ? "Yes"
                                        : "No"}
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Temperature</span>
                                <strong>
                                    {selectedRecord.temperature ??
                                        "-"}{" "}
                                    °C
                                </strong>
                            </div>

                            <div className="record-detail">
                                <span>Rainfall</span>
                                <strong>
                                    {selectedRecord.rainfall ??
                                        "-"}{" "}
                                    mm
                                </strong>
                            </div>
                        </div>

                        <div className="record-modal-footer">
                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setSelectedRecord(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WasteRecords;
