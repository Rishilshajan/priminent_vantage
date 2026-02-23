"use client"

import { Mail } from "lucide-react"

interface EmailBrandingProps {
    senderName?: string;
    emailFooter?: string;
    onSenderNameChange: (text: string) => void;
    onEmailFooterChange: (text: string) => void;
}

export default function EmailBranding({
    senderName = "Priminent Vantage Talent Acquisition",
    emailFooter = "Best regards,\nThe Priminent Vantage Talent Team\nEmpowering Future Leaders",
    onSenderNameChange,
    onEmailFooterChange
}: EmailBrandingProps) {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20 rounded-t-xl">
                <Mail className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Email Branding</h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Sender Name</label>
                    <input
                        className="w-full h-11 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        type="text"
                        value={senderName || ""}
                        onChange={(e) => onSenderNameChange(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">The name candidates see in their inbox for automated communications.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Email Signature</label>
                    <textarea
                        className="w-full p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono outline-none transition-colors"
                        placeholder="Best regards,\nThe [Organization] Team"
                        rows={4}
                        value={emailFooter || ""}
                        onChange={(e) => onEmailFooterChange(e.target.value)}
                    />
                </div>
            </div>
        </section>
    )
}
