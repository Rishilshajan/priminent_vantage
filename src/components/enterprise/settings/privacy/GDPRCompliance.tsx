"use client"

import { Switch } from "@/components/ui/switch"
import { Scale, Download } from "lucide-react"
import Link from "next/link"

export default function GDPRCompliance() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                    <Scale className="text-primary size-6" />
                    <h2 className="font-bold text-slate-900 dark:text-white">GDPR & Compliance</h2>
                </div>
                <Link href="#" className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                    <Download className="size-4" />
                    Download DPA
                </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Enable GDPR Compliance Mode</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Enforces explicit consent checkboxes on all public-facing forms and enables advanced privacy controls for EU citizens.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">'Right to be Forgotten' Automation</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Automatically process data deletion requests submitted via the candidate portal within 72 hours of verification.</p>
                    </div>
                    <Switch />
                </div>
            </div>
        </section>
    )
}
