import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootRedirect from "@/components/auth/RouteRedirect";
import LoginPage from "@/pages/auth/login/page";
import DashboardPage from "@/pages/dashboard/page";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RegisterPage from "@/pages/auth/register/page";
const queryClient = new QueryClient();
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "./pages/NotFound";
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <Routes>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
