import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const logout = useLogout();

    return (
        <Button
            variant="outline"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
        >
            {logout.isPending ? "Logging out..." : "Logout"}
        </Button>
    );
}
