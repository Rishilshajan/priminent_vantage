"use client"

import { Search, Bell, Menu, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ReportsHeaderProps {
    onMenuClick?: () => void;
    userProfile?: any;
}

export default function ReportsHeader({ onMenuClick, userProfile }: ReportsHeaderProps) {
    const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "User"
    const userRole = userProfile?.role === 'admin' ? "Administrator" : userProfile?.role === 'super_admin' ? "Super Admin" : "Member"

    return (
        <header className="h-20 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#191022]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-6 md:gap-10 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95"
                >
                    <Menu className="size-6" />
                </button>

                <div className="relative w-full max-w-lg hidden sm:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        className="w-full pl-12 pr-6 h-12 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                        placeholder="Search simulations, reports, or groups..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-8">
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2.5 text-slate-400 hover:text-primary transition-all sm:hidden active:scale-90">
                        <Search className="size-5" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-primary transition-all relative group active:scale-90">
                        <Bell className="size-5" />
                        <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-white dark:border-[#191022] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(127,19,236,0.3)]"></span>
                    </button>
                    <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-primary transition-all active:scale-90">
                        <HelpCircle className="size-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-4 cursor-pointer group p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight transition-colors">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{userRole}</p>
                    </div>
                    <div className="size-11 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-primary/20 flex items-center justify-center overflow-hidden transition-all group-hover:ring-4 group-hover:ring-primary/10 shadow-lg shadow-primary/5">
                        <span className="material-symbols-outlined text-primary text-[28px] font-bold">person</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
