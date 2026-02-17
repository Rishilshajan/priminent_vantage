"use client"

import { ShieldCheck } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function MFASection() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                <h2 className="font-bold text-slate-900 dark:text-white">Multi-Factor Authentication (MFA)</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Enforce MFA for Admins</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Mandatory secondary verification for all accounts with super-admin or manager privileges. Strongly recommended for platform security.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Enforce MFA for All Users</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Requires every user in the 'Priminent Vantage' workspace to configure MFA upon their next login session.</p>
                    </div>
                    <Switch />
                </div>
            </div>
        </section>
    )
}
