import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
    className?: string;
}

export function ModeToggle({ className }: ModeToggleProps) {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "relative h-8 w-8 rounded-full transition-colors hover:bg-accent",
                            className,
                        )}
                    />
                }
            >
                <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="gap-2"
                >
                    <Sun className="h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="gap-2"
                >
                    <Moon className="h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="gap-2"
                >
                    <Monitor className="h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}