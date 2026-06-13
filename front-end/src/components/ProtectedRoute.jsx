import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// Wrap a route element to require a specific permission.
// If missing, redirects to /forbidden.
export function RequirePermission({ permission, children }) {
  const hasPermission = useAuthStore((s) => s.hasPermission(permission));
  if (!hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
}
