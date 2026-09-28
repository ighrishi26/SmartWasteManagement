import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Recycle,
    Eye,
    EyeOff,
    LogIn,
    BrainCircuit,
    BarChart3,
    Truck,
    ShieldCheck,
    User,
    Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        const cleanUsername = username.trim();

        if (!cleanUsername || !password) {
            setError(
                "Please enter your username and password."
            );
            setLoading(false);
            return;
        }

        try {
            await login(
                cleanUsername,
                password
            );

            navigate("/");
        } catch (error) {
            if (
                error.response?.data?.non_field_errors
            ) {
                setError(
                    error.response.data.non_field_errors[0]
                );
            } else if (
                error.response?.data?.detail
            ) {
                setError(
                    error.response.data.detail
                );
            } else if (
                error.response?.data?.username
            ) {
                setError(
                    error.response.data.username[0]
                );
            } else {
                setError(
                    "Invalid username or password."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-layout">

                {/* Information Panel */}

                <div className="login-info-panel">

                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <Recycle size={24} />
                        </div>

                        <div>
                            <h2>Smart Waste</h2>
                            <span>
                                Management System
                            </span>
                        </div>
                    </div>

                    <div className="login-info-content">

                        <span className="login-eyebrow">
                            INTELLIGENT WASTE MANAGEMENT
                        </span>

                        <h1>
                            Turn Waste Data Into
                            <br />
                            Smarter Decisions.
                        </h1>

                        <p>
                            Monitor waste generation, predict
                            future requirements, detect unusual
                            patterns, and plan collection
                            operations using intelligent analytics.
                        </p>

                        <div className="login-feature-list">

                            <div className="login-feature">
                                <div className="login-feature-icon">
                                    <BrainCircuit size={18} />
                                </div>

                                <div>
                                    <strong>
                                        AI Waste Prediction
                                    </strong>

                                    <span>
                                        Predict future waste generation
                                        using machine learning models.
                                    </span>
                                </div>
                            </div>

                            <div className="login-feature">
                                <div className="login-feature-icon">
                                    <BarChart3 size={18} />
                                </div>

                                <div>
                                    <strong>
                                        Analytics & Insights
                                    </strong>

                                    <span>
                                        Understand waste trends,
                                        locations, and generation patterns.
                                    </span>
                                </div>
                            </div>

                            <div className="login-feature">
                                <div className="login-feature-icon">
                                    <Truck size={18} />
                                </div>

                                <div>
                                    <strong>
                                        Collection Planning
                                    </strong>

                                    <span>
                                        Plan collection priorities based
                                        on predicted waste levels.
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="login-info-footer">
                        AI-Based Smart Waste Generation Prediction
                        & Collection Planning System
                    </div>
                </div>

                {/* Login Form Panel */}

                <div className="login-form-panel">
                    <div className="login-form-container">

                        <div className="login-form-header">

                            <div className="login-icon">
                                <LogIn size={23} />
                            </div>

                            <div>
                                <h2>Welcome back</h2>

                                <p>
                                    Sign in to access your
                                    management dashboard.
                                </p>
                            </div>

                        </div>

                        {error && (
                            <div
                                className="login-message error"
                                role="alert"
                            >
                                <ShieldCheck size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="login-field">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div className="login-input-wrapper">

                                    <User size={17} />

                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(event) =>
                                            setUsername(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="login-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <Lock size={17} />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loading}
                            >
                                <LogIn size={17} />

                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </button>

                        </form>

                        <div className="login-footer">
                            <span>
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="login-register-link"
                            >
                                Create an account
                            </button>
                        </div>

                        <div className="login-security">
                            <ShieldCheck size={15} />

                            <span>
                                Secure Management Portal
                            </span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;