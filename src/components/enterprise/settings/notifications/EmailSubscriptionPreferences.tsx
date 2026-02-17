"use client"

import { Switch } from "@/components/ui/switch"
import { Mail } from "lucide-react"

export default function EmailSubscriptionPreferences() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Mail className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Email Subscription Preferences</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Candidate Summary</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">A high-level overview of candidate progress and recruitment funnel performance delivered every Monday.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">New Simulation Enrollment</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Receive an automated notification whenever a new candidate begins an assessment simulation.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Simulation Completion Alerts</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Immediate notification upon the successful completion of a candidate evaluation.</p>
                    </div>
                    <Switch />
                </div>
            </div>
        </section>
    )
}
