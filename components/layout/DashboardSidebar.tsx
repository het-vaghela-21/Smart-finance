"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    ReceiptText,
    Bot,
    Newspaper,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Zap,
    Shield,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sidebarNavItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Charts", href: "/dashboard/charts", icon: BarChart3 },
    { title: "Transactions", href: "/dashboard/transactions", icon: ReceiptText },
    { title: "Financial Goals", href: "/dashboard/goals", icon: Target },
    { title: "AI Suggestions", href: "/dashboard/ai-suggestions", icon: Bot },
    { title: "Newsletter",     href: "/dashboard/newsletter",   icon: Newspaper },
];

export const DashboardSidebar = memo(function DashboardSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, userRole, logout } = useAuth();

    return (
        <aside
            className={cn(
                "sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col flex-shrink-0",
                isCollapsed ? "w-[80px]" : "w-[260px]"
            )}
            style={{
                background: "rgba(8, 6, 20, 0.75)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(124,58,237,0.12)",
            }}
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-between px-5 border-b"
                style={{ borderColor: "rgba(124,58,237,0.12)" }}>
                <div className={cn("flex items-center gap-2.5 text-white font-bold text-xl tracking-tight transition-all", isCollapsed && "opacity-0 invisible w-0")}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}>
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    Fin<span style={{ color: "#9F67FF" }}>AI</span>
                </div>
                {isCollapsed && (
                    <div className="absolute left-5 h-full flex items-center top-0 justify-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}>
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                <div className={cn("text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3 px-2 transition-all", isCollapsed && "opacity-0")}>
                    Navigation
                </div>

                {sidebarNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group relative",
                                isActive
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white"
                            )}
                            style={isActive ? {
                                background: "rgba(124,58,237,0.15)",
                                border: "1px solid rgba(124,58,237,0.30)",
                                boxShadow: "0 0 16px rgba(124,58,237,0.15)",
                            } : {
                                border: "1px solid transparent",
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.background = "";
                                    (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
                                }
                            }}
                        >
                            {/* Active left border indicator */}
                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                                    style={{ background: "linear-gradient(to bottom, #7C3AED, #22D3EE)" }} />
                            )}
                            {isActive && isCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                    style={{ background: "#7C3AED" }} />
                            )}

                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-[#9F67FF]" : "text-zinc-500 group-hover:text-white")} />
                            <span className={cn("transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                                {item.title}
                            </span>

                            {/* Tooltip when collapsed */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap"
                                    style={{ background: "rgba(13,13,26,0.95)", border: "1px solid rgba(124,58,237,0.25)" }}>
                                    {item.title}
                                </div>
                            )}
                        </Link>
                    );
                })}

                {/* Admin Link */}
                {userRole === "admin" && (
                    <Link
                        href="/admin"
                        prefetch={true}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group relative mt-3",
                            pathname === "/admin" ? "text-[#22D3EE]" : "text-zinc-400 hover:text-[#22D3EE]"
                        )}
                        style={pathname === "/admin" ? {
                            background: "rgba(34,211,238,0.08)",
                            border: "1px solid rgba(34,211,238,0.25)",
                        } : { border: "1px solid transparent" }}
                    >
                        <Shield className={cn("w-5 h-5 flex-shrink-0", pathname === "/admin" ? "text-[#22D3EE]" : "text-zinc-500 group-hover:text-[#22D3EE]")} />
                        <span className={cn("transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                            Admin Panel
                        </span>
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg text-[#22D3EE] text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap"
                                style={{ background: "rgba(13,13,26,0.95)", border: "1px solid rgba(34,211,238,0.25)" }}>
                                Admin Panel
                            </div>
                        )}
                    </Link>
                )}
            </div>

            {/* User Info */}
            {!isCollapsed && user && (
                <div className="px-3 py-3 mx-3 mb-2 rounded-xl"
                    style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}>
                            {(user.displayName || user.email || "U")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user.displayName || "User"}</p>
                            <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapse toggle */}
            <div className="p-3" style={{ borderTop: "1px solid rgba(124,58,237,0.10)" }}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /> <span>Collapse</span></>}
                </button>
            </div>

            {/* Sign Out */}
            <div className="p-3 pb-6">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors group relative"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className={cn("transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                        Sign Out
                    </span>
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg text-red-400 text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap"
                            style={{ background: "rgba(13,13,26,0.95)", border: "1px solid rgba(239,68,68,0.2)" }}>
                            Sign Out
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
});
