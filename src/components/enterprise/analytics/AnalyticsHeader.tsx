"use client"

import { Search, Bell, Menu, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AnalyticsHeaderProps {
    onMenuClick?: () => void;
    userProfile?: any;
}

export default function AnalyticsHeader({ onMenuClick, userProfile }: AnalyticsHeaderProps) {
    const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "User"
    const userRole = userProfile?.role === 'admin' ? "Administrator" : userProfile?.role === 'super_admin' ? "Super Admin" : "Member"

    return (
        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#1f1629]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu className="size-6" />
                </button>

                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        className="w-full pl-10 pr-4 h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Search insights, metrics, or candidates..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1 md:gap-3">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors md:hidden">
                        <Search className="size-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                        <Bell className="size-5" />
                        <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1f1629]"></span>
                    </button>
                    <button className="hidden sm:flex p-2 text-slate-400 hover:text-primary transition-colors">
                        <HelpCircle className="size-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
                    <div className="text-right hidden xl:block">
                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{userName}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{userRole}</p>
                    </div>
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
