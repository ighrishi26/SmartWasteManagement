import { useEffect, useState } from "react";
import {
    Activity,
    BarChart3,
    CalendarDays,
    RefreshCw,
    TrendingUp,
    MapPin,
    Recycle,
    Users,
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
import AccessDenied from "./AccessDenied";

function Analytics() {
    const { hasPermission } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAnalytics();
            setData(response);
        } catch (err) {
            console.error(err);
            setError("Unable to load analytics data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAnalytics();

                if (!cancelled) {
                    setData(response);
                }
            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setError("Unable to load analytics data.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchAnalytics();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!hasPermission("analytics")) {
    return <AccessDenied />;
}

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-loading">
                    <RefreshCw className="spin" size={24} />
                    <span>Loading analytics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-error">
                    <Activity size={22} />

                    <div>
                        <strong>Analytics unavailable</strong>
                        <p>{error}</p>
                    </div>

                    <button
                        className="analytics-refresh-button"
                        onClick={loadAnalytics}
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const statistics = data?.statistics || {};

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div>
                    <div className="analytics-breadcrumb">
                        Waste Management <span>/</span> Analytics
                    </div>

                    <h1>Waste Analytics</h1>

                    <p>
                        Monitor waste generation patterns and understand
                        operational trends.
                    </p>
                </div>

                <button
                    className="analytics-refresh-button"
                    onClick={loadAnalytics}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="analytics-stat-grid">
                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        <Recycle size={20} />
                    </div>

                    <div>
                        <span>Total Waste</span>

                        <strong>
                            {statistics.total_waste?.toLocaleString()} kg
                        </strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        <BarChart3 size={20} />
                    </div>

                    <div>
                        <span>Average Waste</span>

                        <strong>
                            {statistics.average_waste?.toLocaleString()} kg
                        </strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        <TrendingUp size={20} />
                    </div>

                    <div>
                        <span>Maximum Waste</span>

                        <strong>
                            {statistics.maximum_waste?.toLocaleString()} kg
                        </strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <span>Records</span>

                        <strong>
                            {statistics.total_records?.toLocaleString()}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="analytics-chart-grid">
                <div className="analytics-chart-card analytics-chart-wide">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Daily Waste Trend</h2>
                            <p>Waste generation over time</p>
                        </div>

                        <TrendingUp size={20} />
                    </div>

                    <div className="analytics-chart">
                        {data.daily_trends?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.daily_trends}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        strokeWidth={2.5}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="analytics-empty">
                                No daily data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="analytics-chart-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Waste by Type</h2>
                            <p>Total quantity by category</p>
                        </div>

                        <Recycle size={20} />
                    </div>

                    <div className="analytics-chart">
                        {data.waste_types?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.waste_types}
                                    layout="vertical"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                    />

                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="waste_type"
                                        width={75}
                                        tick={{ fontSize: 10 }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        radius={[0, 5, 5, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="analytics-empty">
                                No waste type data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="analytics-chart-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Waste by Location</h2>
                            <p>Generation across locations</p>
                        </div>

                        <MapPin size={20} />
                    </div>

                    <div className="analytics-chart">
                        {data.locations?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.locations}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="location"
                                        tick={{ fontSize: 10 }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="analytics-empty">
                                No location data available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="analytics-chart-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Monthly Trend</h2>
                            <p>Monthly waste generation</p>
                        </div>

                        <CalendarDays size={20} />
                    </div>

                    <div className="analytics-chart">
                        {data.monthly_trends?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthly_trends}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total_waste"
                                        name="Waste (kg)"
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="analytics-empty">
                                No monthly data available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="analytics-analysis-grid">
                <div className="analytics-analysis-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Holiday Analysis</h2>
                            <p>Holiday vs normal-day waste</p>
                        </div>

                        <CalendarDays size={20} />
                    </div>

                    <div className="analytics-analysis-list">
                        {data.holiday_analysis?.map((item) => (
                            <div
                                className="analytics-analysis-row"
                                key={item.category}
                            >
                                <span>{item.category}</span>

                                <strong>
                                    {item.total_waste.toLocaleString()} kg
                                </strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analytics-analysis-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Special Events</h2>
                            <p>Event-related waste patterns</p>
                        </div>

                        <Activity size={20} />
                    </div>

                    <div className="analytics-analysis-list">
                        {data.special_event_analysis?.map((item) => (
                            <div
                                className="analytics-analysis-row"
                                key={item.category}
                            >
                                <span>{item.category}</span>

                                <strong>
                                    {item.total_waste.toLocaleString()} kg
                                </strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analytics-analysis-card analytics-footfall-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Footfall & Waste</h2>
                            <p>Visitor activity against waste generation</p>
                        </div>

                        <Users size={20} />
                    </div>

                    <div className="analytics-footfall-list">
                        {data.footfall_analysis?.slice(0, 8).map(
                            (item, index) => (
                                <div
                                    className="analytics-footfall-row"
                                    key={`${item.date}-${item.location}-${index}`}
                                >
                                    <div>
                                        <strong>{item.location}</strong>
                                        <span>{item.date}</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {item.waste} kg
                                        </strong>

                                        <span>
                                            {item.footfall} visitors
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;