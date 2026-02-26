"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Layers,
    ChevronDown,
    LogOut,
    Settings,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentHeaderProps {
    userData: {
        first_name?: string | null;
        last_name?: string | null;
        fullName?: string | null;
        avatar_url?: string | null;
        avatarUrl?: string | null;
    };
    orgBranding?: {
        brand_color: string | null;
        logo_url: string | null;
    } | null;
}

export function StudentHeader({ userData, orgBranding }: StudentHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};
    const brandColorBg = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorBorder = orgBranding?.brand_color ? { borderColor: orgBranding.brand_color } : {};

    const displayName = userData.fullName || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "User";
    const userInitials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase() || "U";

    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to log out?")) return;
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error);
            alert("Failed to log out.");
            return;
        }
        router.push("/");
        router.refresh();
    };

    return (
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-12">
                <Link href="/student/dashboard" className="flex items-center gap-3 group">
                    {orgBranding?.logo_url ? (
                        <img src={orgBranding.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
                    ) : (
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20" style={brandColorBg}>
                            <Layers className="size-6 text-white" />
                        </div>
                    )}
                    <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase">
                        VANTAGE
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-10 h-20">
                    <Link
                        className={cn(
                            "relative h-full flex items-center text-[13px] font-black uppercase tracking-widest transition-all",
                            pathname === "/student/dashboard"
                                ? "text-primary"
                                : "text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-white"
                        )}
                        style={pathname === "/student/dashboard" ? brandColorText : {}}
                        href="/student/dashboard"
                    >
                        Dashboard
                        {pathname === "/student/dashboard" && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-primary animate-in fade-in slide-in-from-bottom-1" style={brandColorBg} />
                        )}
                    </Link>
                    <Link
                        className={cn(
                            "relative h-full flex items-center text-[13px] font-black uppercase tracking-widest transition-all",
                            pathname.startsWith("/student/simulations")
                                ? "text-primary"
                                : "text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-white"
                        )}
                        style={pathname.startsWith("/student/simulations") ? brandColorText : {}}
                        href="/student/simulations"
                    >
                        Job Simulations
                        {pathname.startsWith("/student/simulations") && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-primary animate-in fade-in slide-in-from-bottom-1" style={brandColorBg} />
                        )}
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm group"
                    >
                        <div className="size-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:border-primary/50 transition-colors" style={isProfileOpen ? brandColorBorder : {}}>
                            {(userData.avatar_url || userData.avatarUrl) ? (
                                <img src={(userData.avatar_url || userData.avatarUrl)!} alt={displayName} className="size-full object-cover" />
                            ) : (
                                <User className="size-4 text-slate-400" />
                            )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{displayName}</span>
                        <ChevronDown className={cn("size-4 text-slate-400 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden py-1">
                                <Link
                                    href="/student/settings"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <Settings className="size-4" />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
