import { useCallback, useEffect, useState } from "react";
import {
    Lightbulb,
    AlertTriangle,
    Clock,
    Info,
    RefreshCw,
    CheckCircle2,
    ShieldAlert,
} from "lucide-react";

import { getRecommendations } from "../services/recommendationService";
import { useAuth } from "../context/AuthContext";

function Recommendations() {
    const { hasPermission } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getRecommendations();
            setData(result);
        } catch (err) {
            console.error(err);
            setError("Unable to load recommendations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            await loadRecommendations();
        };

        fetchRecommendations();
    }, [loadRecommendations]);

    if (!hasPermission("recommendations")) {
        return (
            <div className="recommendations-page">
                <div className="recommendations-access-denied">
                    <div className="recommendations-access-denied-icon">
                        <ShieldAlert size={28} />
                    </div>

                    <h2>Access Restricted</h2>

                    <p>
                        You do not have permission to use
                        the Recommendations module.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="recommendations-page">
                <div className="recommendations-loading">
                    Loading recommendations...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendations-page">
                <div className="recommendations-error">
                    <AlertTriangle size={20} />
                    {error}
                </div>

                <button
                    className="recommendations-refresh"
                    onClick={loadRecommendations}
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    const summary = data?.summary || {};
    const recommendations = data?.recommendations || [];

    const getIcon = (type) => {
        if (type === "high") {
            return <AlertTriangle size={21} />;
        }

        if (type === "medium") {
            return <Clock size={21} />;
        }

        return <Info size={21} />;
    };

    return (
        <div className="recommendations-page">
            <div className="recommendations-header">
                <div>
                    <span className="recommendations-eyebrow">
                        SMART WASTE INSIGHTS
                    </span>

                    <h1>Recommendations</h1>

                    <p>
                        Data-driven insights generated from your
                        waste records and collection patterns.
                    </p>
                </div>

                <button
                    className="recommendations-refresh"
                    onClick={loadRecommendations}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="recommendations-stats">
                <div className="recommendation-stat-card">
                    <div className="recommendation-stat-icon">
                        <Lightbulb size={20} />
                    </div>

                    <div>
                        <span>Total Insights</span>

                        <strong>
                            {summary.total_recommendations || 0}
                        </strong>
                    </div>
                </div>

                <div className="recommendation-stat-card">
                    <div className="recommendation-stat-icon high">
                        <AlertTriangle size={20} />
                    </div>

                    <div>
                        <span>High Priority</span>

                        <strong>
                            {summary.high_priority || 0}
                        </strong>
                    </div>
                </div>

                <div className="recommendation-stat-card">
                    <div className="recommendation-stat-icon medium">
                        <Clock size={20} />
                    </div>

                    <div>
                        <span>Medium Priority</span>

                        <strong>
                            {summary.medium_priority || 0}
                        </strong>
                    </div>
                </div>

                <div className="recommendation-stat-card">
                    <div className="recommendation-stat-icon info">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Informational</span>

                        <strong>
                            {summary.informational || 0}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="recommendations-section">
                <div className="recommendations-section-header">
                    <div>
                        <span className="recommendations-section-label">
                            DATA-DRIVEN ANALYSIS
                        </span>

                        <h2>Generated Insights</h2>
                    </div>

                    <span className="recommendations-count">
                        {recommendations.length} insights
                    </span>
                </div>

                {recommendations.length === 0 ? (
                    <div className="recommendations-empty">
                        <Lightbulb size={32} />

                        <h3>No recommendations available</h3>

                        <p>
                            Add more waste records to generate
                            useful insights.
                        </p>
                    </div>
                ) : (
                    <div className="recommendations-list">
                        {recommendations.map((item, index) => (
                            <div
                                className={`recommendation-card ${item.type}`}
                                key={`${item.title}-${index}`}
                            >
                                <div className="recommendation-icon">
                                    {getIcon(item.type)}
                                </div>

                                <div className="recommendation-content">
                                    <div className="recommendation-card-top">
                                        <h3>
                                            {item.title}
                                        </h3>

                                        <span
                                            className={`recommendation-badge ${item.type}`}
                                        >
                                            {item.type === "high"
                                                ? "High Priority"
                                                : item.type === "medium"
                                                    ? "Medium Priority"
                                                    : "Information"}
                                        </span>
                                    </div>

                                    <p>
                                        {item.description}
                                    </p>

                                    <div className="recommendation-action">
                                        <strong>
                                            Recommended Action
                                        </strong>

                                        <span>
                                            {item.action}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Recommendations;