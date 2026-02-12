"use client"

import { ShieldCheck, CheckSquare, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationChecklistProps {
    checklist: { label: string; description: string; checked: boolean }[];
    onToggle: (index: number) => void;
    disabled?: boolean;
}

export function VerificationChecklist({ checklist, onToggle, disabled }: VerificationChecklistProps) {
    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-opacity",
            disabled && "opacity-80"
        )}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                    <ShieldCheck className="size-4 text-primary" />
                    Admin Verification
                </h3>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[9px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    {disabled ? "Finalized" : "Manual"}
                </span>
            </div>

            <div className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Security Checklist</p>
                <div className="space-y-3">
                    {checklist.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => !disabled && onToggle(index)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all group",
                                item.checked
                                    ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400",
                                !disabled && "cursor-pointer hover:border-slate-200 hover:bg-slate-100/50"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                item.checked ? "bg-primary text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-300"
                            )}>
                                {item.checked ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold leading-tight">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
