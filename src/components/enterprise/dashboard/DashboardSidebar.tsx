"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth/shared.auth"


import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
    orgName?: string;
    className?: string;
    onLinkClick?: () => void;
    userProfile?: {
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        avatar_url?: string | null;
    } | null;
    orgLogo?: string | null;
}

export default function DashboardSidebar({ orgName = "Priminent", className, onLinkClick, userProfile, orgLogo }: DashboardSidebarProps) {
    const pathname = usePathname()

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?")
        if (confirmed) {
            await signOut("/")
        }
    }

    const navItems = [
        { label: "Dashboard", href: "/enterprise/dashboard", icon: "dashboard" },
        { label: "Simulations", href: "/enterprise/simulations", icon: "layers" },
        { label: "Candidates", href: "/enterprise/candidates", icon: "groups" },
        { label: "Analytics", href: "/enterprise/analytics", icon: "insights" },
        { label: "Simulation Reports", href: "/enterprise/reports", icon: "summarize" },
    ]

    const orgItems = [
        { label: "Instructors", href: "/enterprise/instructors", icon: "corporate_fare" },
        { label: "Settings", href: "/enterprise/settings/organization", icon: "settings" },
    ]

    return (
        <aside className={cn("hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 h-screen sticky top-0 overflow-y-auto", className)}>
            <div className="p-6 flex items-center gap-3">
                <div className="size-9 text-white flex items-center justify-center bg-primary rounded-lg shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl font-bold">diamond</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight leading-none">{orgName}</span>
                    <span className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">Vantage</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 pt-4">
                <p className="px-2 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-all border ${isActive
                                ? "bg-primary/5 text-primary border-primary/10 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"
                                }`}
                            onClick={onLinkClick}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </Link>
                    )
                })}


                <p className="px-2 pt-8 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</p>
                {orgItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl border border-transparent"
                        onClick={onLinkClick}
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 mb-4 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {userProfile?.avatar_url ? (
                                <div
                                    className="size-11 rounded-2xl bg-cover bg-center shadow-inner border border-white dark:border-slate-700"
                                    style={{ backgroundImage: `url('${userProfile.avatar_url}')` }}
                                />
                            ) : (
                                <div className="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                    <span className="material-symbols-outlined text-[24px]">person</span>
                                </div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-[13px] font-black text-slate-900 dark:text-white truncate tracking-tight">
                                    {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "User Profile"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold truncate tracking-wide mt-0.5">
                                    {userProfile?.email || "No email available"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 px-1">
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-primary/40 shrink-0"></span>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
                                    {orgName}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-emerald-400/40 shrink-0"></span>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.15em] leading-none">
                                    {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? 'Enterprise Admin' : userProfile?.role || 'Organization Member'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full h-11 text-[10px] font-black uppercase tracking-[0.2em] bg-red-50/50 hover:bg-red-50 text-red-500 border border-red-100/50 dark:bg-red-500/5 dark:hover:bg-red-500/10 dark:text-red-400 dark:border-red-500/10 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
