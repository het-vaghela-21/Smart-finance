import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardBackground } from "@/components/ui/DashboardBackground";
import { DashboardProvider } from "@/components/DashboardProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen relative flex w-full">
            {/* Isolated Dashboard Background */}
            <DashboardBackground />

            <DashboardProvider>
                {/* Sidebar Shell */}
                <DashboardSidebar />

                {/* Main Content Area */}
                <main className="flex-1 w-full relative z-10 p-4 md:p-6 lg:p-8 min-w-0 transition-all duration-300">
                    {children}
                </main>
            </DashboardProvider>
        </div>
    );
}
