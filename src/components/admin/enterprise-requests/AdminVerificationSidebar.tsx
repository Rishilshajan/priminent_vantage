"use client"

import { ShieldCheck, History, Info, Save } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface AdminVerificationSidebarProps {
    checklist: { label: string; checked: boolean }[]
    notes: string
    history: { event: string; date: string; type: "success" | "warning" }[]
    onToggleCheck: (index: number) => void
    onNotesChange: (notes: string) => void
    onSaveProgress: () => void
}

export function AdminVerificationSidebar({
    checklist,
    notes,
    history,
    onToggleCheck,
    onNotesChange,
    onSaveProgress
}: AdminVerificationSidebarProps) {
    return (
        <aside className="space-y-8 animate-fade-in-up delay-300">
            <div className="bg-white dark:bg-slate-900 border border-primary/20 rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-primary size-5" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                            Admin Verification
                        </h3>
                    </div>
                    <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded tracking-tighter">
                        MANUAL
                    </span>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Security Checklist</p>
                    <div className="space-y-2">
                        {checklist.map((item, i) => (
                            <label
                                key={i}
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors"
                            >
                                <Checkbox
                                    checked={item.checked}
                                    onCheckedChange={() => onToggleCheck(i)}
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Internal Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary focus:border-primary p-3 min-h-[120px] transition-all"
                        placeholder="Add observations for other admins..."
                    />
                </div>

                <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Review History</p>
                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-700">
                        {history.map((item, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-[23px] top-1 size-3.5 rounded-full border-4 border-white dark:border-slate-900 ${item.type === "success" ? "bg-green-500" : "bg-amber-500"
                                    }`} />
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                                    {item.event}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">
                                    {item.date}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <Button
                        onClick={onSaveProgress}
                        className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Save className="size-4" />
                        Save Review Progress
                    </Button>
                </div>
            </div>
        </aside>
    )
}
