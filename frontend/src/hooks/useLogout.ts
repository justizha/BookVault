import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useLogout() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            clearAuth();
            navigate("/login");
        },
        onError: () => {
            clearAuth();
            navigate("/login");
        },
    });
}
