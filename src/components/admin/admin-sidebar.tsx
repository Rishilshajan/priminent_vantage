"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
    LayoutDashboard,
    Building2,
    Key,
    FileText,
    Settings,
    LogOut,
    Monitor
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar({ user, isOpen, onClose }: { user: any, isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        // ... (existing logic)
        const confirmed = window.confirm("Are you sure you want to log out?")
        if (!confirmed) return

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error("Logout error:", error)
                alert("Failed to log out. Please try again.")
                return
            }
            router.push("/")
            router.refresh()
        } catch (err) {
            console.error("Unexpected error during logout:", err)
        }
    }

    // ... (links array)
    const links = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard // Material: dashboard
        },
        {
            href: "/dashboard/organization",
            label: "Organization Mgmt",
            icon: Building2 // Material: corporate_fare
        },
        {
            href: "/dashboard/access-codes",
            label: "Access Codes",
            icon: Key // Material: password
        },
        {
            href: "/dashboard/logs",
            label: "System Logs",
            icon: FileText // Material: receipt_long
        },
        // Settings commonly separate
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Monitor className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">Prominent</h1>
                        <p className="text-primary text-xs font-semibold uppercase tracking-wider">Vantage</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <link.icon className="size-5" />
                                <p className="text-sm font-medium">{link.label}</p>
                            </Link>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <Settings className="size-5" />
                            <p className="text-sm font-medium">Settings</p>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2">
                        <div
                            className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name ? `${user.first_name}+${user.last_name || ''}` : user?.email || 'Admin'}&background=random`})`
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : "Admin User"}
                            </p>
                            <p className="text-xs text-slate-500 truncate" title={user?.email}>
                                {user?.email || "No Email"}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors"
                            title="Log Out"
                        >
                            <LogOut className="size-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
