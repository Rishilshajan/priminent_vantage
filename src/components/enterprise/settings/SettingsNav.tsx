"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SettingsNav() {
    const pathname = usePathname()

    const navItems = [
        { label: "Organization", href: "#", icon: "domain" },
        { label: "Security", href: "/enterprise/settings", icon: "shield_person" },
        { label: "Team & Access", href: "#", icon: "group_add" },
        { label: "Notifications", href: "#", icon: "notifications_active" },
        { label: "Data & Privacy", href: "#", icon: "lock" },
        { label: "Integrations", href: "#", icon: "extension" },
        { label: "Billing", href: "#", icon: "payments" },
    ]

    return (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1f1629] sticky top-0 z-20 px-8">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${isActive
                                ? "border-primary text-primary"
                                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                            {item.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
