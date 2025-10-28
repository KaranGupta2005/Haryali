import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/api/authApi";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setIsAuthenticated(true);
        setUserRole(res.data.user.role);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "farmer") return <Navigate to="/farmer/dashboard" replace />;
    if (userRole === "buyer") return <Navigate to="/buyer/dashboard" replace />;
    if (userRole === "logistics") return <Navigate to="/logistics/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
