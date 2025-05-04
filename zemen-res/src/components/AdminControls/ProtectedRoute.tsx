import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

interface Props {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { token } = useAdminAuth();

    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default ProtectedRoute;
