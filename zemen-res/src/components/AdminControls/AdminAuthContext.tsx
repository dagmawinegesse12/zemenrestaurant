import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminUser {
    username: string;
}

interface AdminAuthContextType {
    adminUser: AdminUser | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("adminToken");
        if (savedToken) {
            setToken(savedToken);
            fetchAdminUser(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAdminUser = async (token: string) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/orders/profile/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAdminUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch admin user", error);
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string) => {
        localStorage.setItem("adminToken", token);
        setToken(token);
        fetchAdminUser(token);
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        setToken(null);
        setAdminUser(null);
    };

    return (
        <AdminAuthContext.Provider value={{ adminUser, token, loading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    }
    return context;
};
