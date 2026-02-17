"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AnalyticsHeader() {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1f1629] flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-8 flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        className="w-full pl-10 pr-4 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Search insights, metrics, or candidates..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#1f1629]"></span>
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Alex Sterling</p>
                        <p className="text-[10px] text-slate-400">Chief Analytics Officer</p>
                    </div>
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
