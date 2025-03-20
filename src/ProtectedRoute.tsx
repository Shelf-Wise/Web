// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "./state/store"; // Update this path to match your store location

interface ProtectedRouteProps {
  allowedPath?: string;
}

const ProtectedRoute = ({ allowedPath }: ProtectedRouteProps) => {
  // Replace this with the actual path to your auth state in the Redux store
  // For example, if you're using localStorage for authentication:
  const isAuthenticated = localStorage.getItem("token") !== null;
  const currentPath = window.location.pathname;

  // Allow access to the specific public path without authentication
  if (allowedPath && currentPath === allowedPath) {
    return <Outlet />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
