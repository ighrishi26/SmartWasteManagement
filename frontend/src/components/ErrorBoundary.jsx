import { Component } from "react";
import { RefreshCw, Recycle } from "lucide-react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            "SmartWaste application error:",
            error
        );

        console.error(
            "Component error information:",
            errorInfo
        );
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-page">
                    <div className="error-boundary-card">
                        <div className="error-boundary-icon">
                            <Recycle size={30} />
                        </div>

                        <span className="error-boundary-code">
                            ERROR
                        </span>

                        <h1>
                            Something went wrong
                        </h1>

                        <p>
                            The application encountered
                            an unexpected error. Please
                            reload the page and try again.
                        </p>

                        <button
                            className="error-boundary-button"
                            onClick={this.handleReload}
                        >
                            <RefreshCw size={17} />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;