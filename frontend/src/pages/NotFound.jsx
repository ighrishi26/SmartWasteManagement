import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Recycle } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-icon">
                    <Recycle size={30} />
                </div>

                <span className="not-found-code">
                    404
                </span>

                <h1>Page Not Found</h1>

                <p>
                    The page you're looking for doesn't
                    exist or may have been moved.
                </p>

                <div className="not-found-actions">
                    <button
                        className="not-found-primary"
                        onClick={() => navigate("/")}
                    >
                        <Home size={17} />
                        Dashboard
                    </button>

                    <button
                        className="not-found-secondary"
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

export default NotFound;