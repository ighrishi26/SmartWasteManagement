import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    BarChart3,
    BrainCircuit,
    CalendarDays,
    MapPin,
    RefreshCw,
    Recycle,
    TrendingUp,
    Truck,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { getAnalytics } from "../services/analyticsService";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();

    const {
        hasPermission,
        user,
    } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAnalytics();
            setData(response);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAnalytics();

                if (isMounted) {
                    setData(response);
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(
                        "Unable to load dashboard data."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <RefreshCw
                        size={24}
                        className="spin"
                    />
                    <span>
                        Loading dashboard...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <Activity size={22} />

                    <div>
                        <strong>
                            Dashboard unavailable
                        </strong>

                        <p>{error}</p>
                    </div>

                    <button
                        className="dashboard-refresh-button"
                        onClick={loadDashboard}
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const statistics =
        data?.statistics || {};

    const dailyTrends =
        data?.daily_trends || [];

    const wasteTypes =
        data?.waste_types || [];

    const locations =
        data?.locations || [];

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <div className="dashboard-breadcrumb">
                        Smart Waste Management
                        <span>/</span>
                        Dashboard
                    </div>

                    <h1>
                        Good to see you,{" "}
                        {user?.username || "User"}
                    </h1>

                    <p>
                        Monitor waste generation,
                        operational activity and
                        environmental trends.
                    </p>
                </div>

                <button
                    className="dashboard-refresh-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-stat-grid">
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        <Recycle size={20} />
                    </div>

                    <div>
                        <span>
                            Total Waste
                        </span>

                        <strong>
                            {(
                                statistics.total_waste ||
                                0
                            ).toLocaleString()}{" "}
                            kg
                        </strong>

                        <small>
                            Across all records
                        </small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        <BarChart3 size={20} />
                    </div>

                    <div>
                        <span>
                            Average Waste
                        </span>

                        <strong>
                            {(
                                statistics.average_waste ||
                                0
                            ).toLocaleString()}{" "}
                            kg
                        </strong>

                        <small>
                            Average per record
                        </small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        <TrendingUp size={20} />
                    </div>

                    <div>
                        <span>
                            Maximum Waste
                        </span>

                        <strong>
                            {(
                                statistics.maximum_waste ||
                                0
                            ).toLocaleString()}{" "}
                            kg
                        </strong>

                        <small>
                            Highest recorded
                        </small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <span>
                            Total Records
                        </span>

                        <strong>
                            {(
                                statistics.total_records ||
                                0
                            ).toLocaleString()}
                        </strong>

                        <small>
                            Waste observations
                        </small>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                <div className="dashboard-chart-card dashboard-chart-wide">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>
                                Waste Generation Trend
                            </h2>

                            <p>
                                Recent waste generation
                                activity
                            </p>
                        </div>

                        <TrendingUp size={20} />
                    </div>

                    <div className="dashboard-chart">
                        {dailyTrends.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={dailyTrends}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fontSize: 10,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 10,
                                        }}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        strokeWidth={2.5}
                                        dot={{
                                            r: 3,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="dashboard-empty">
                                No trend data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-chart-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>
                                Waste by Type
                            </h2>

                            <p>
                                Quantity by category
                            </p>
                        </div>

                        <Recycle size={20} />
                    </div>

                    <div className="dashboard-chart">
                        {wasteTypes.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={wasteTypes}
                                    layout="vertical"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                    />

                                    <XAxis
                                        type="number"
                                        tick={{
                                            fontSize: 10,
                                        }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="waste_type"
                                        width={65}
                                        tick={{
                                            fontSize: 9,
                                        }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        radius={[
                                            0,
                                            5,
                                            5,
                                            0,
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="dashboard-empty">
                                No waste type data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-chart-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>
                                Waste by Location
                            </h2>

                            <p>
                                Generation by location
                            </p>
                        </div>

                        <MapPin size={20} />
                    </div>

                    <div className="dashboard-chart">
                        {locations.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={locations}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="location"
                                        tick={{
                                            fontSize: 9,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 10,
                                        }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        radius={[
                                            5,
                                            5,
                                            0,
                                            0,
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="dashboard-empty">
                                No location data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-quick-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Access common operations
                            </p>
                        </div>

                        <Activity size={20} />
                    </div>

                    <div className="dashboard-actions">
                        {hasPermission(
                            "prediction"
                        ) && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/prediction"
                                    )
                                }
                            >
                                <BrainCircuit
                                    size={19}
                                />

                                <span>
                                    <strong>
                                        Waste Prediction
                                    </strong>

                                    <small>
                                        Predict upcoming
                                        waste generation
                                    </small>
                                </span>
                            </button>
                        )}

                        {hasPermission(
                            "collection_planning"
                        ) && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/collection-planning"
                                    )
                                }
                            >
                                <Truck size={19} />

                                <span>
                                    <strong>
                                        Collection Planning
                                    </strong>

                                    <small>
                                        Review collection
                                        priorities
                                    </small>
                                </span>
                            </button>
                        )}

                        {hasPermission(
                            "analytics"
                        ) && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/analytics"
                                    )
                                }
                            >
                                <BarChart3 size={19} />

                                <span>
                                    <strong>
                                        Detailed Analytics
                                    </strong>

                                    <small>
                                        Explore waste
                                        analytics
                                    </small>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;