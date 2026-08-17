import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FileQuestionIcon } from "lucide-react";

/**
 * Displays a 404 page with a link back to the dashboard.
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
            <FileQuestionIcon className="size-16 text-muted-foreground" />
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground">
                This page doesn't exist yet — or you took a wrong turn.
            </p>
            <Button render={<Link to="/dashboard" />}>Back to Dashboard</Button>
        </div>
    );
}
