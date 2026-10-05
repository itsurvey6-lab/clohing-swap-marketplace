import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const checkAdmin = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await api.get("/users/me");

                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }

            } catch (error) {

                console.log(
                    "Admin authorization error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        checkAdmin();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Checking admin access...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;