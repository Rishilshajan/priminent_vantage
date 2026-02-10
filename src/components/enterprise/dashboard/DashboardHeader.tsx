"use client"

import { Bell, Search, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
    orgName: string;
}

export default function DashboardHeader({ orgName }: DashboardHeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex-1 flex items-center gap-4">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-full h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        placeholder="Search simulations, reports, or candidates..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative text-slate-400 hover:text-primary transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
                <button className="text-slate-400 hover:text-primary transition-colors">
                    <HelpCircle className="size-5" />
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black leading-none mb-1 text-slate-900 dark:text-white uppercase tracking-tight">{orgName}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Admin Account</p>
                    </div>
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
