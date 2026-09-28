import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const defaultPermissions = {
    dashboard: false,
    waste_records_view: false,
    waste_records_create: false,
    waste_records_edit: false,
    waste_records_delete: false,
    prediction: false,
    collection_planning: false,
    recommendations: false,
    reports: false,
    anomalies: false,
    csv_import: false,
    analytics: false,
    ml_models: false,
    settings: false,
};

const normalizeUser = (user) => {
    return {
        ...user,
        permissions: {
            ...defaultPermissions,
            ...(user?.permissions || {}),
        },
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => {
        return !!localStorage.getItem("smartWasteToken");
    });

    useEffect(() => {
        const token = localStorage.getItem("smartWasteToken");

        if (!token) {
            return;
        }

        api.get("auth/me/")
            .then((response) => {
                setUser(normalizeUser(response.data.user));
            })
            .catch((error) => {
                console.error(
                    "Authentication check failed:",
                    error
                );

                localStorage.removeItem("smartWasteToken");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (username, password) => {
        const response = await api.post(
            "auth/login/",
            {
                username,
                password,
            }
        );

        localStorage.setItem(
            "smartWasteToken",
            response.data.token
        );

        const loggedInUser = normalizeUser(
            response.data.user
        );

        setUser(loggedInUser);

        return response.data;
    };

    const logout = () => {
    localStorage.removeItem("smartWasteToken");
    setUser(null);
};

    const hasPermission = (permission) => {
        return !!user?.permissions?.[permission];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                hasPermission,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
