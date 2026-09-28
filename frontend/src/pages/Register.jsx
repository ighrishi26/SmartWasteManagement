import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlus,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Recycle,
    BrainCircuit,
    BarChart3,
    Truck,
} from "lucide-react";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const getErrorMessage = (error) => {
        const data = error.response?.data;

        if (!data) {
            return "Unable to create account. Please try again.";
        }

        if (typeof data === "string") {
            return data;
        }

        if (data.detail) {
            return data.detail;
        }

        if (data.username) {
            return Array.isArray(data.username)
                ? data.username[0]
                : data.username;
        }

        if (data.email) {
            return Array.isArray(data.email)
                ? data.email[0]
                : data.email;
        }

        if (data.password) {
            return Array.isArray(data.password)
                ? data.password[0]
                : data.password;
        }

        if (data.confirm_password) {
            return Array.isArray(data.confirm_password)
                ? data.confirm_password[0]
                : data.confirm_password;
        }

        return "Unable to create account. Please check your details.";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.username.trim()) {
            setError("Please enter a username.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (formData.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirm_password
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "auth/register/",
                formData
            );

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (requestError) {
            setError(
                getErrorMessage(requestError)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-layout">

                <section className="register-info-panel">
                    <div className="register-brand">
                        <div className="register-brand-icon">
                            <Recycle size={26} />
                        </div>

                        <div>
                            <h2>
                                Smart Waste
                            </h2>

                            <span>
                                Management System
                            </span>
                        </div>
                    </div>

                    <div className="register-info-content">
                        <span className="register-eyebrow">
                            SMART ENVIRONMENT PLATFORM
                        </span>

                        <h1>
                            Manage waste smarter.
                            <br />
                            Build a cleaner future.
                        </h1>

                        <p>
                            Create your account and access
                            intelligent waste analytics,
                            prediction, monitoring, and
                            collection planning tools.
                        </p>

                        <div className="register-feature-list">

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    <BrainCircuit size={18} />
                                </div>

                                <div>
                                    <strong>
                                        AI Waste Prediction
                                    </strong>

                                    <span>
                                        Predict future waste
                                        generation using ML.
                                    </span>
                                </div>
                            </div>

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    <BarChart3 size={18} />
                                </div>

                                <div>
                                    <strong>
                                        Analytics & Insights
                                    </strong>

                                    <span>
                                        Understand waste trends
                                        and patterns.
                                    </span>
                                </div>
                            </div>

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    <Truck size={18} />
                                </div>

                                <div>
                                    <strong>
                                        Collection Planning
                                    </strong>

                                    <span>
                                        Plan collection priorities
                                        using intelligent data.
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="register-info-footer">
                        AI-powered waste management platform
                    </div>
                </section>

                <section className="register-form-panel">

                    <div className="register-form-container">

                        <div className="register-form-header">
                            <div className="register-icon">
                                <UserPlus size={24} />
                            </div>

                            <div>
                                <h2>
                                    Create Account
                                </h2>

                                <p>
                                    Enter your details to create
                                    your account.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="register-message error">
                                <AlertCircle size={17} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="register-message success">
                                <CheckCircle2 size={17} />
                                <span>{success}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="register-form"
                        >

                            <div className="register-form-row">

                                <div className="register-field">
                                    <label htmlFor="username">
                                        Username
                                    </label>

                                    <div className="register-input-wrapper">
                                        <User size={17} />

                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Enter username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="register-field">
                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <div className="register-input-wrapper">
                                        <Mail size={17} />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="register-form-row">

                                <div className="register-field">
                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <div className="register-input-wrapper">
                                        <Lock size={17} />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            disabled={loading}
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="register-field">
                                    <label htmlFor="confirm_password">
                                        Confirm Password
                                    </label>

                                    <div className="register-input-wrapper">
                                        <Lock size={17} />

                                        <input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm password"
                                            value={
                                                formData.confirm_password
                                            }
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            disabled={loading}
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div className="register-role-info">
                                <div className="register-role-icon">
                                    <User size={15} />
                                </div>

                                <div>
                                    <strong>
                                        Default Account Type: Viewer
                                    </strong>

                                    <span>
                                        New accounts receive Viewer
                                        access. Administrators can
                                        manage roles later.
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>

                        <div className="register-footer">
                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Sign In
                            </Link>
                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
}

export default Register;
