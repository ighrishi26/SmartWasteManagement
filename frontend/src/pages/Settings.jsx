import {
    Settings as SettingsIcon,
    ShieldCheck,
    Database,
    BrainCircuit,
    Recycle,
    Info,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AccessDenied from "./AccessDenied";

function Settings() {
    const { user, hasPermission } = useAuth();

    if (!hasPermission("settings")) {
        return <AccessDenied />;
    }

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <span className="settings-eyebrow">
                        SYSTEM CONFIGURATION
                    </span>

                    <h1>Settings</h1>

                    <p>
                        Manage system information and review
                        SmartWaste configuration.
                    </p>
                </div>

                <div className="settings-header-icon">
                    <SettingsIcon size={24} />
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <h2>Account Information</h2>
                            <p>
                                Current administrator account
                                information.
                            </p>
                        </div>
                    </div>

                    <div className="settings-info-list">
                        <div className="settings-info-row">
                            <span>Username</span>
                            <strong>
                                {user?.username || "Administrator"}
                            </strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Email</span>
                            <strong>
                                {user?.email || "Not available"}
                            </strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Role</span>
                            <strong>
                                {user?.role || "Administrator"}
                            </strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Access Level</span>
                            <strong>Full System Access</strong>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <Recycle size={21} />
                        </div>

                        <div>
                            <h2>Collection Thresholds</h2>
                            <p>
                                Current waste collection priority
                                configuration.
                            </p>
                        </div>
                    </div>

                    <div className="settings-threshold-list">
                        <div className="settings-threshold-item">
                            <div>
                                <span className="settings-threshold-label">
                                    Low Priority
                                </span>

                                <p>
                                    Routine collection required
                                </p>
                            </div>

                            <strong>&lt; 50 kg</strong>
                        </div>

                        <div className="settings-threshold-item">
                            <div>
                                <span className="settings-threshold-label">
                                    Medium Priority
                                </span>

                                <p>
                                    Collection should be scheduled
                                </p>
                            </div>

                            <strong>50 – 149.99 kg</strong>
                        </div>

                        <div className="settings-threshold-item">
                            <div>
                                <span className="settings-threshold-label">
                                    High Priority
                                </span>

                                <p>
                                    Immediate collection required
                                </p>
                            </div>

                            <strong>≥ 150 kg</strong>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <Database size={21} />
                        </div>

                        <div>
                            <h2>System Information</h2>
                            <p>
                                Technology stack used by the
                                application.
                            </p>
                        </div>
                    </div>

                    <div className="settings-info-list">
                        <div className="settings-info-row">
                            <span>Frontend</span>
                            <strong>React + Vite</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Backend</span>
                            <strong>Django REST Framework</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Database</span>
                            <strong>SQLite</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Authentication</span>
                            <strong>Token Authentication</strong>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <BrainCircuit size={21} />
                        </div>

                        <div>
                            <h2>AI & Machine Learning</h2>
                            <p>
                                Machine learning capabilities
                                available in SmartWaste.
                            </p>
                        </div>
                    </div>

                    <div className="settings-feature-list">
                        <div className="settings-feature-item">
                            <span>Waste Prediction</span>
                            <span className="settings-status">
                                Available
                            </span>
                        </div>

                        <div className="settings-feature-item">
                            <span>Model Comparison</span>
                            <span className="settings-status">
                                Available
                            </span>
                        </div>

                        <div className="settings-feature-item">
                            <span>Anomaly Detection</span>
                            <span className="settings-status">
                                Available
                            </span>
                        </div>

                        <div className="settings-feature-item">
                            <span>Collection Planning</span>
                            <span className="settings-status">
                                Available
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-information-banner">
                <Info size={18} />

                <div>
                    <strong>SmartWaste Management System</strong>

                    <p>
                        AI-based waste generation prediction and
                        collection planning platform.
                    </p>
                </div>

                <div className="settings-version">
                    Version 1.0
                </div>
            </div>
        </div>
    );
}

export default Settings;