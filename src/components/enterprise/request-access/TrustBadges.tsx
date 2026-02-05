import { Lock, FileText, Shield, BadgeCheck } from "lucide-react";

export function TrustBadges() {
    return (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3 grayscale opacity-60 hover:opacity-100 transition-opacity">
                <Lock className="size-10 text-slate-600 dark:text-slate-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">SOC2 Type II</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3 grayscale opacity-60 hover:opacity-100 transition-opacity">
                <FileText className="size-10 text-slate-600 dark:text-slate-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">GDPR Compliant</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3 grayscale opacity-60 hover:opacity-100 transition-opacity">
                <Shield className="size-10 text-slate-600 dark:text-slate-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">AES-256 Data</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3 grayscale opacity-60 hover:opacity-100 transition-opacity">
                <BadgeCheck className="size-10 text-slate-600 dark:text-slate-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Global Verified</span>
            </div>
        </div>
    );
}
