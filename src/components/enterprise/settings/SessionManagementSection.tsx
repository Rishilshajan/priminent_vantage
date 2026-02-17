"use client"

import { Button } from "@/components/ui/button"

export default function SessionManagementSection() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <span className="material-symbols-outlined text-primary text-2xl">timer</span>
                <h2 className="font-bold text-slate-900 dark:text-white">Session Management</h2>
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-md w-full">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Automatic Session Timeout</label>
                        <select className="w-full h-11 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                            <option value="15">15 Minutes of Inactivity</option>
                            <option value="30">30 Minutes of Inactivity</option>
                            <option value="60" defaultValue="60">1 Hour of Inactivity</option>
                            <option value="240">4 Hours of Inactivity</option>
                            <option value="480">8 Hours of Inactivity</option>
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1.5">Users will be automatically logged out after this duration of idle time.</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 px-6 h-11 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/20 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all whitespace-nowrap">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Force Logout All Devices
                    </Button>
                </div>
            </div>
        </section>
    )
}
