import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute() {
    const token = useAuthStore((s) => s.token);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}
