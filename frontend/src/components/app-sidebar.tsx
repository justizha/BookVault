import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    LayoutDashboardIcon,
    BookOpenIcon,
    PackageIcon,
    TagIcon,
    UsersIcon,
    LifeBuoyIcon,
    LibraryIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: <LayoutDashboardIcon />,
            isActive: true,
        },
        {
            title: "Books",
            url: "/books",
            icon: <BookOpenIcon />,
        },
        {
            title: "Stock",
            url: "/stock",
            icon: <PackageIcon />,
        },
        {
            title: "Prices",
            url: "/prices",
            icon: <TagIcon />,
        },
        {
            title: "Users",
            url: "/users",
            icon: <UsersIcon />,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: <LifeBuoyIcon />,
        },
    ],
};

/**
 * Renders the application's navigation sidebar with primary navigation, support links, and the authenticated user's information.
 *
 * @param props - Properties forwarded to the sidebar component.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const authUser = useAuthStore((s) => s.user);

    const user = {
        name: authUser?.name ?? "Guest",
        email: authUser?.email ?? "",
        avatar: "",
    };

    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={<Link to="/dashboard" />}
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <LibraryIcon className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    BookVault
                                </span>
                                <span className="truncate text-xs">
                                    Store Management
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
