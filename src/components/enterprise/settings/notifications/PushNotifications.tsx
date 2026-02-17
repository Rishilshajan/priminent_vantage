"use client"

import { Switch } from "@/components/ui/switch"
import { Smartphone } from "lucide-react"

export default function PushNotifications() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Smartphone className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Push Notifications</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Browser-Based Alerts</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Enable urgent desktop notifications for immediate team-related activity and mentions.</p>
                    </div>
                    <Switch />
                </div>
            </div>
        </section>
    )
}
