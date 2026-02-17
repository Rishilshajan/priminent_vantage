"use client"

import { Switch } from "@/components/ui/switch"
import { ShieldAlert } from "lucide-react"

export default function SystemSecurityAlerts() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <ShieldAlert className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">System & Security Alerts</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">New Enterprise Access Requests</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Alerts for new team member invites or external access requests requiring approval.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Critical Security Logs</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Real-time alerts for failed login attempts, unauthorized API calls, or security policy violations.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">SSO Configuration Changes</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Notifications regarding modifications to SAML settings, SCIM provisioning, or identity provider updates.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>
        </section>
    )
}
