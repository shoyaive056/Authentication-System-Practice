import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FullPageSpinner from "./FullPageSpinner.jsx";

export default function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <FullPageSpinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
