import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface AdminThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextProps | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const stored = localStorage.getItem("adminTheme") as Theme | null;
        if (stored) setTheme(stored);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("adminTheme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
};

export const useAdminTheme = () => {
    const context = useContext(AdminThemeContext);
    if (!context) throw new Error("useAdminTheme must be used within AdminThemeProvider");
    return context;
};
