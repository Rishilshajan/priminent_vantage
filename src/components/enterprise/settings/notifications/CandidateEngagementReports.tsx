"use client"

import { FileBarChart } from "lucide-react"

export default function CandidateEngagementReports() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <FileBarChart className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Candidate Engagement Reports</h2>
            </div>
            <div className="p-6">
                <div className="max-w-md">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Report Delivery Frequency</label>
                    <select className="w-full h-11 px-4 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        <option value="daily">Daily Summary</option>
                        <option value="weekly">Weekly Comprehensive Report</option>
                        <option value="monthly">Monthly Executive Overview</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1.5">Automated reports will be sent to the primary administrator's registered email address.</p>
                </div>
            </div>
        </section>
    )
}
