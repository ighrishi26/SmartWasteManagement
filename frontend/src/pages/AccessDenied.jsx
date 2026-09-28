import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Home,
    LockKeyhole,
} from "lucide-react";

function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="access-denied-page">
            <div className="access-denied-card">
                <div className="access-denied-icon">
                    <LockKeyhole size={32} />
                </div>

                <span className="access-denied-code">
                    403
                </span>

                <h1>Access Restricted</h1>

                <p>
                    You do not have permission to access
                    this page with your current account.
                </p>

                <div className="access-denied-actions">
                    <button
                        className="access-denied-primary"
                        onClick={() => navigate("/")}
                    >
                        <Home size={17} />
                        Dashboard
                    </button>

                    <button
                        className="access-denied-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={17} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccessDenied;