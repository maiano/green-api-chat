import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.credentials !== null);
  return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />;
}
