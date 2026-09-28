import { useEffect, useState } from "react";
import {
    Truck,
    MapPin,
    Weight,
    AlertTriangle,
    Clock,
    CheckCircle2,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";

import { getCollectionPlan } from "../services/collectionService";
import { useAuth } from "../context/AuthContext";

function CollectionPlanning() {
    const { hasPermission } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPlan = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getCollectionPlan();
            setData(result);
        } catch (err) {
            console.error(err);
            setError("Unable to load collection planning data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchPlan = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getCollectionPlan();

                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(
                        "Unable to load collection planning data."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPlan();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!hasPermission("collection_planning")) {
        return (
            <div className="collection-page">
                <div className="collection-access-denied">
                    <div className="collection-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to use
                        the Collection Planning module.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="collection-page">
                <div className="collection-loading">
                    Loading collection plan...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="collection-page">
                <div className="collection-error">
                    <AlertTriangle size={20} />
                    {error}
                </div>

                <button
                    className="collection-refresh-button"
                    onClick={loadPlan}
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    const summary = data?.summary || {};
    const thresholds = data?.thresholds || {};
    const locations = data?.locations || [];

    return (
        <div className="collection-page">
            <div className="collection-header">
                <div>
                    <span className="collection-eyebrow">
                        COLLECTION MANAGEMENT
                    </span>

                    <h1>Collection Planning</h1>

                    <p>
                        Plan waste collection based on location-wise
                        waste levels and collection priority.
                    </p>
                </div>

                <button
                    className="collection-refresh-button"
                    onClick={loadPlan}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="collection-stats">
                <div className="collection-stat-card">
                    <div className="collection-stat-icon">
                        <MapPin size={20} />
                    </div>

                    <div>
                        <span>Total Locations</span>
                        <strong>
                            {summary.total_locations || 0}
                        </strong>
                    </div>
                </div>

                <div className="collection-stat-card">
                    <div className="collection-stat-icon">
                        <Weight size={20} />
                    </div>

                    <div>
                        <span>Total Waste</span>
                        <strong>
                            {summary.total_waste || 0} kg
                        </strong>
                    </div>
                </div>

                <div className="collection-stat-card">
                    <div className="collection-stat-icon high">
                        <AlertTriangle size={20} />
                    </div>

                    <div>
                        <span>High Priority</span>
                        <strong>
                            {summary.high_priority || 0}
                        </strong>
                    </div>
                </div>

                <div className="collection-stat-card">
                    <div className="collection-stat-icon medium">
                        <Clock size={20} />
                    </div>

                    <div>
                        <span>Medium Priority</span>
                        <strong>
                            {summary.medium_priority || 0}
                        </strong>
                    </div>
                </div>

                <div className="collection-stat-card">
                    <div className="collection-stat-icon low">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Low Priority</span>
                        <strong>
                            {summary.low_priority || 0}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="collection-threshold-card">
                <div>
                    <span className="collection-section-label">
                        COLLECTION THRESHOLDS
                    </span>

                    <h2>Priority Configuration</h2>
                </div>

                <div className="collection-thresholds">
                    <div className="threshold-item">
                        <span className="threshold-dot low"></span>

                        <div>
                            <strong>Low Priority</strong>

                            <span>
                                Below {thresholds.low_max_kg} kg
                            </span>
                        </div>
                    </div>

                    <div className="threshold-item">
                        <span className="threshold-dot medium"></span>

                        <div>
                            <strong>Medium Priority</strong>

                            <span>
                                {thresholds.low_max_kg}–
                                {thresholds.medium_max_kg - 0.01} kg
                            </span>
                        </div>
                    </div>

                    <div className="threshold-item">
                        <span className="threshold-dot high"></span>

                        <div>
                            <strong>High Priority</strong>

                            <span>
                                {thresholds.medium_max_kg} kg and above
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="collection-table-card">
                <div className="collection-table-header">
                    <div>
                        <span className="collection-section-label">
                            LOCATION ANALYSIS
                        </span>

                        <h2>Collection Plan</h2>
                    </div>

                    <span className="collection-location-count">
                        {locations.length} locations
                    </span>
                </div>

                {locations.length === 0 ? (
                    <div className="collection-empty">
                        <Truck size={30} />

                        <h3>No collection data available</h3>

                        <p>
                            Add waste records to generate a collection plan.
                        </p>
                    </div>
                ) : (
                    <div className="collection-table-wrapper">
                        <table className="collection-table">
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Total Waste</th>
                                    <th>Average Waste</th>
                                    <th>Records</th>
                                    <th>Priority</th>
                                    <th>Recommendation</th>
                                </tr>
                            </thead>

                            <tbody>
                                {locations.map((location) => (
                                    <tr key={location.location}>
                                        <td>
                                            <div className="collection-location">
                                                <MapPin size={16} />

                                                <strong>
                                                    {location.location}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            <strong>
                                                {location.total_waste} kg
                                            </strong>
                                        </td>

                                        <td>
                                            {location.average_waste} kg
                                        </td>

                                        <td>
                                            {location.record_count}
                                        </td>

                                        <td>
                                            <span
                                                className={`collection-priority ${location.priority.toLowerCase()}`}
                                            >
                                                {location.priority_label}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="collection-recommendation">
                                                {location.recommendation}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CollectionPlanning;