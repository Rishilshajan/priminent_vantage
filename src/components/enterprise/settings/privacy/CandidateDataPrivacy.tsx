"use client"

import { Switch } from "@/components/ui/switch"
import { EyeOff } from "lucide-react"

export default function CandidateDataPrivacy() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <EyeOff className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Candidate Data Privacy</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Anonymize Candidate Names in Analytics</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Replace actual names with unique identifiers in all exportable reports and dashboard visualization modules to protect identity.</p>
                    </div>
                    <Switch />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Restrict Data Access to Specific Recruiter Roles</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Limit full contact detail visibility only to Lead Recruiters and Hiring Managers directly assigned to the specific job requisition.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>
        </section>
    )
}
