import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { Recycle } from "lucide-react";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import WasteRecords from "./pages/WasteRecords";
import WasteRecordForm from "./pages/WasteRecordForm";
import Analytics from "./pages/Analytics";
import MLModels from "./pages/MLModels";
import Settings from "./pages/Settings";
import CSVImport from "./pages/CSVImport";
import Prediction from "./pages/Prediction";
import Anomalies from "./pages/Anomalies";
import CollectionPlanning from "./pages/CollectionPlanning";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Register from "./pages/Register";

import {
    AuthProvider,
    useAuth,
} from "./context/AuthContext";


function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="app-loading-screen">
                <div className="app-loading-card">
                    <div className="app-loading-icon">
                        <Recycle size={28} />
                    </div>

                    <span className="app-loading-label">
                        SMART WASTE MANAGEMENT
                    </span>

                    <h2>SmartWaste</h2>

                    <p>
                        Connecting to the management system...
                    </p>

                    <div className="app-loading-spinner"></div>

                        <small className="app-loading-status">
                            Verifying your session
                        </small>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="waste-records"
                    element={<WasteRecords />}
                />

                <Route
                    path="waste-records/add"
                    element={
                        <WasteRecordForm />
                    }
                />

                <Route
                    path="waste-records/edit/:id"
                    element={
                        <WasteRecordForm />
                    }
                />

                <Route
                    path="csv-import"
                    element={<CSVImport />}
                />

                <Route
                    path="analytics"
                    element={<Analytics />}
                />

                <Route
                    path="ml-models"
                    element={<MLModels />}
                />

                <Route
                    path="prediction"
                    element={<Prediction />}
                />

                <Route
                    path="anomalies"
                    element={<Anomalies />}
                />

                <Route
                    path="collection-planning"
                    element={
                        <CollectionPlanning />
                    }
                />

                <Route
                    path="recommendations"
                    element={
                        <Recommendations />
                    }
                />

                <Route
                    path="reports"
                    element={<Reports />}
                />

                <Route
                    path="settings"
                    element={<Settings />}
                />

                <Route 
                    path="*" 
                    element={<NotFound />} 
                />
            </Route>
        </Routes>
    );
}


function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
