"use client"

import { Award } from "lucide-react"

export default function CertificateDefaults() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Award className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Certificate Defaults</h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Default Signatory Name</label>
                            <input className="w-full h-11 px-4 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="Helena Richards" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Signatory Title</label>
                            <input className="w-full h-11 px-4 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="Chief People Officer" />
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 relative">
                        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</div>
                        <div className="flex flex-col items-center pt-4">
                            <div className="w-16 h-px bg-slate-300 dark:bg-slate-600 mb-4"></div>
                            <p className="font-display font-bold text-slate-800 dark:text-white">Helena Richards</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">Chief People Officer</p>
                            <div className="mt-6 border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Official Seal</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
