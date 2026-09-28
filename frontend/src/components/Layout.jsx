import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHealthStatus } from "../services/healthService";
import {
    LayoutDashboard,
    Trash2,
    BarChart3,
    Brain,
    Settings,
    Recycle,
    FileSpreadsheet,
    BrainCircuit,
    AlertTriangle,
    Truck,
    Lightbulb,
    FileText,
    LogOut,
    User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Layout() {
    const navigate = useNavigate();

    const {
        user,
        logout,
        hasPermission,
    } = useAuth();

    const [systemStatus, setSystemStatus] = useState("checking");

    const navigation = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard,
            permission: "dashboard",
        },
        {
            name: "Waste Records",
            path: "/waste-records",
            icon: Trash2,
            permission: "waste_records_view",
        },
        {
            name: "Waste Prediction",
            path: "/prediction",
            icon: BrainCircuit,
            permission: "prediction",
        },
        {
            name: "Collection Planning",
            path: "/collection-planning",
            icon: Truck,
            permission: "collection_planning",
        },
        {
            name: "Recommendations",
            path: "/recommendations",
            icon: Lightbulb,
            permission: "recommendations",
        },
        {
            name: "Reports",
            path: "/reports",
            icon: FileText,
            permission: "reports",
        },
        {
            name: "Anomalies",
            path: "/anomalies",
            icon: AlertTriangle,
            permission: "anomalies",
        },
        {
            name: "CSV Import",
            path: "/csv-import",
            icon: FileSpreadsheet,
            permission: "csv_import",
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: BarChart3,
            permission: "analytics",
        },
        {
            name: "ML Models",
            path: "/ml-models",
            icon: Brain,
            permission: "ml_models",
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings,
            permission: "settings",
        },
    ];

    const visibleNavigation = navigation.filter(
        (item) =>
            hasPermission(item.permission)
    );

    const handleLogout = () => {
    const confirmed = window.confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    logout();
    navigate("/login");
};

    useEffect(() => {
    const checkSystemHealth = async () => {
        try {
            await getHealthStatus();
            setSystemStatus("online");
        } catch (error) {
            console.error("System health check failed:", error);
            setSystemStatus("offline");
        }
    };

    checkSystemHealth();

    const interval = setInterval(
        checkSystemHealth,
        30000
    );

    return () => clearInterval(interval);
}, []);

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <Recycle size={22} />
                    </div>

                    <div>
                        <h2>SmartWaste</h2>
                        <span>
                            Management System
                        </span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-heading">
                        MAIN MENU
                    </p>

                    {visibleNavigation.map(
                        (item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({
                                        isActive,
                                    }) =>
                                        `nav-item ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >
                                    <Icon size={19} />
                                    <span>
                                        {item.name}
                                    </span>
                                </NavLink>
                            );
                        }
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <User size={18} />
                        </div>

                        <div className="user-details">
                            <strong>
                                {user?.username ||
                                    "User"}
                            </strong>

                            <span>
                                {user?.role ||
                                    "Viewer"}
                            </span>
                        </div>
                    </div>

                    <div className="system-status">
    <span
        className={`status-dot ${
            systemStatus === "offline"
                ? "offline"
                : systemStatus === "checking"
                ? "checking"
                : ""
        }`}
    ></span>

    <div>
        <strong>
            {systemStatus === "online"
                ? "System Online"
                : systemStatus === "offline"
                ? "System Offline"
                : "Checking System"}
        </strong>

        <small>
            {systemStatus === "online"
                ? "Django API Connected"
                : systemStatus === "offline"
                ? "Django API Unavailable"
                : "Connecting to Django API"}
        </small>
    </div>
</div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div>
                        <h1>
                            Smart Waste Management
                        </h1>

                        <p>
                            Monitor, analyze and
                            predict waste generation.
                        </p>
                    </div>

                    <div className="header-badge">
                        <Recycle size={18} />
                        AI Waste Intelligence
                    </div>
                </header>

                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default Layout;
