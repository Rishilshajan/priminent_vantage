"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Rocket, Award, Compass, BarChart3, Settings, LogOut, X } from "lucide-react"
import { signOut } from "@/actions/auth/shared.auth"

interface StudentSidebarProps {
    user: any;
    isOpen?: boolean;
    onClose?: () => void;
}

export function StudentSidebar({ user, isOpen, onClose }: StudentSidebarProps) {
    const pathname = usePathname()

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
        { icon: Rocket, label: "My Simulations", href: "/student/simulations" },
        { icon: Award, label: "Skills & Certifications", href: "/student/skills" },
        { icon: Compass, label: "Simulation Library", href: "/student/library" }
    ]

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-border-color bg-white transition-transform duration-300 ease-in-out dark:bg-[#1e1429] dark:border-white/10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative aspect-square size-12 overflow-hidden rounded-full bg-primary/10">
                                <div className="flex items-center justify-center h-full w-full bg-primary text-white font-bold text-xl">
                                    PV
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-tight text-text-main dark:text-white">Priminent Vantage</h1>
                                <p className="text-sm font-normal text-text-secondary dark:text-gray-400">Student Portal</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-main dark:text-white lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-white"
                                            : "text-text-main hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("size-5", isActive ? "fill-current" : "")} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="flex flex-col gap-2 p-6 border-t border-border-color dark:border-white/10">
                    <Link
                        href="/student/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-main transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                        <Settings className="size-5" />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <div className="mt-2 flex items-center gap-3 px-3 py-2">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20 bg-slate-200">
                            {/* Avatar Placeholder if no image */}
                            <div className="flex items-center justify-center h-full w-full text-slate-500 font-bold">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="truncate text-sm font-bold text-text-main dark:text-white">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="truncate text-xs text-text-secondary dark:text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={async () => await signOut()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-text-main transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 mt-1"
                    >
                        <LogOut className="size-5" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
