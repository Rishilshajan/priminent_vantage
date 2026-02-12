"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Rocket, Users, BookOpen, BarChart3, Settings, LogOut, GraduationCap } from "lucide-react"
import { signOut } from "@/actions/auth/shared.auth"

interface EducatorSidebarProps {
    user: any
}

export function EducatorSidebar({ user }: EducatorSidebarProps) {
    const pathname = usePathname()

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/educators/dashboard" },
        { icon: Rocket, label: "My Simulations", href: "/educators/simulations" },
        { icon: Users, label: "Student Progress", href: "/educators/students" },
        { icon: BookOpen, label: "Course Management", href: "/educators/courses" },
        { icon: BarChart3, label: "Reports", href: "/educators/reports" },
    ]

    return (
        <aside className="hidden w-72 flex-col justify-between border-r border-border-color bg-white dark:bg-[#1e1429] dark:border-white/10 lg:flex h-screen sticky top-0">
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="relative aspect-square size-12 overflow-hidden rounded-full bg-primary/10">
                        {/* Placeholder Logo */}
                        <div className="flex items-center justify-center h-full w-full bg-primary text-white font-bold text-xl">
                            PV
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold leading-tight text-text-main dark:text-white">Priminent Vantage</h1>
                        <p className="text-sm font-normal text-text-secondary dark:text-gray-400">Educator Portal</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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

                    {/* Apply as Educator - Highlighted */}
                    <Link
                        href="/educators/apply"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 mt-4 bg-gradient-to-r from-purple-500 to-primary text-white hover:from-purple-600 hover:to-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        <GraduationCap className="size-5" />
                        <span className="text-sm font-bold">Apply as Educator</span>
                    </Link>
                </nav>
            </div>
            <div className="flex flex-col gap-2 p-6 border-t border-border-color dark:border-white/10">
                <Link
                    href="/educators/settings"
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
    )
}
