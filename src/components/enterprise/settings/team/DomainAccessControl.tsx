"use client"

import { Switch } from "@/components/ui/switch"
import { X, Plus, AtSign } from "lucide-react"

export default function DomainAccessControl() {
    return (
        <section className="bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-primary/[0.02]">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">domain_verification</span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Domain Access Control</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">Auto-approve users with matching domain</span>
                    <Switch defaultChecked />
                </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-2 bg-[#f3effb] dark:bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-semibold">
                            @prominentvantage.com
                            <button className="hover:text-red-500 transition-colors"><X className="size-3" /></button>
                        </div>
                        <div className="flex items-center gap-2 bg-[#f3effb] dark:bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-semibold">
                            @vantage-labs.io
                            <button className="hover:text-red-500 transition-colors"><X className="size-3" /></button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm outline-none bg-slate-50 dark:bg-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="Add another domain (e.g. @partner.com)"
                                type="text"
                            />
                        </div>
                        <button className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                            Add Domain
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
