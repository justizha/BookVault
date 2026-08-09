import { Navigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function RootRedirect() {
    const token = useAuthStore((s) => s.token);
    return token ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <Navigate to="/login" replace />
    );
}
