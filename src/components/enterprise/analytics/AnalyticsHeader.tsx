"use client"

import { Search, Bell, Menu, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AnalyticsHeaderProps {
    onMenuClick?: () => void;
    userProfile?: any;
    onSearch?: (query: string) => void;
    orgName?: string;
}

export default function AnalyticsHeader({ onMenuClick, userProfile, onSearch, orgName = "Organization" }: AnalyticsHeaderProps) {
    const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "User"
    const userRole = userProfile?.role === 'admin' ? "Administrator" : userProfile?.role === 'super_admin' ? "Super Admin" : "Enterprise"

    return (
        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#1f1629]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu className="size-6" />
                </button>

                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        className="w-full pl-10 pr-4 h-10 bg-slate-50 dark:bg-[#130d1a]/50 border-slate-200 dark:border-slate-800 rounded-xl text-[13px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
                        placeholder="Search insights, metrics, or candidates..."
                        type="text"
                        onChange={(e) => onSearch?.(e.target.value)}
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

                <div className="flex items-center gap-3 md:gap-4 cursor-pointer group">
                    <div className="text-right hidden xl:flex flex-col">
                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.05em]">{userRole}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{orgName}</span>
                        </div>
                        <p className="text-xs font-black text-slate-800 dark:text-white tracking-tight">{userName}</p>
                    </div>
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
