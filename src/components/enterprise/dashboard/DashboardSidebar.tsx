"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth/shared.auth"


export default function DashboardSidebar() {
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
        { label: "Analytics", href: "#", icon: "insights" },
    ]

    const orgItems = [
        { label: "Departments", href: "#", icon: "corporate_fare" },
        { label: "Settings", href: "#", icon: "settings" },
    ]

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 h-screen sticky top-0 overflow-y-auto">
            <div className="p-6 flex items-center gap-3">
                <div className="size-9 text-white flex items-center justify-center bg-primary rounded-lg shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl font-bold">diamond</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight leading-none">Priminent</span>
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
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">Account</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">End your session</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        className="w-full h-9 text-[10px] font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-200 dark:shadow-none border-none transition-all"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    )
}
