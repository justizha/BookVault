import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BooksSummaryPage from "@/pages/summary/page";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

/**
 * Renders the books summary dashboard with its header and sidebar navigation.
 */
export default function Page() {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        <BooksSummaryPage />
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
