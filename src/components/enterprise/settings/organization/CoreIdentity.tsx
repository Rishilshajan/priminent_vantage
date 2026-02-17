"use client"

import { Badge, Upload, FileUp, Star } from "lucide-react"

export default function CoreIdentity() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Badge className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Core Identity</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company Logo (Light)</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group h-32">
                        <FileUp className="text-slate-400 group-hover:text-primary mb-2 size-6" />
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">SVG, PNG (Max 5MB)<br />For dark backgrounds</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company Logo (Dark)</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-slate-900 transition-all cursor-pointer group h-32">
                        <FileUp className="text-slate-500 group-hover:text-primary mb-2 size-6" />
                        <p className="text-[10px] text-slate-400 text-center font-medium">SVG, PNG (Max 5MB)<br />For light backgrounds</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Favicon</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group h-32">
                        <Star className="text-slate-400 group-hover:text-primary mb-2 size-6" />
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">32x32px or 64x64px<br />ICO, PNG</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
