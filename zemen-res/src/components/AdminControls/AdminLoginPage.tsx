import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

const AdminLoginPage: React.FC = () => {
    const [tokenInput, setTokenInput] = useState("");
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        if (tokenInput.trim()) {
            login(tokenInput.trim());
            navigate("/admin-dashboard");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Admin Login</h1>
                <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter Admin Token"
                    className="w-full p-3 border rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default AdminLoginPage;
