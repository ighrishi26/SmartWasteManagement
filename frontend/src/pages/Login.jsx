import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Recycle,
    Eye,
    EyeOff,
    LogIn,
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
            <div className="login-card">

                <div className="login-brand">
                    <div className="login-logo">
                        <Recycle size={30} />
                    </div>

                    <div>
                        <h1>Smart Waste</h1>
                        <p>
                            Management System
                        </p>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Welcome back</h2>

                    <p>
                        Sign in to access your waste
                        management dashboard.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="username">
                            Username
                        </label>

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

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-input">
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
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="password-toggle"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="login-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        <LogIn size={18} />

                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>

                <div className="login-system-status">
    <span className="login-status-dot"></span>
    <span>Secure Management Portal</span>
</div>

                <div className="login-footer">
                    AI-Based Smart Waste Generation
                    Prediction & Collection Planning
                </div>
            </div>
        </div>
    );
}

export default Login;