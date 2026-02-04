import { Key, Mail, ShieldAlert, Download } from "lucide-react"

export function AccessCodeActions() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Management Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Key className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Batch Generate</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Create codes for multiple orgs</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Mail className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Email Distribution</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Resend codes to administrators</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <ShieldAlert className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Expiry Rules</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Configure default durations</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Download className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Export Dataset</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Download full CSV report</p>
                </button>
            </div>
        </div>
    )
}
