import api from "@/lib/axios";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const login = (payload: LoginPayload) =>
    api.post("/login", payload).then((res) => res.data);

export const register = (payload: RegisterPayload) =>
    api.post("/register", payload).then((res) => res.data);

export const logout = () => api.post("/logout");
