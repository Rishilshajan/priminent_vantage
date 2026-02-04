import { PlusCircle, KeyRound, Mail, Database } from "lucide-react"

export function QuickActions() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Administrative Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <PlusCircle className="text-primary mb-2 block group-hover:scale-110 transition-transform size-6" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">New Org</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Manual onboarding</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <KeyRound className="text-primary mb-2 block group-hover:scale-110 transition-transform size-6" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Access Code Manager</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Audit & regenerate codes</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Mail className="text-primary mb-2 block group-hover:scale-110 transition-transform size-6" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Distribute Codes</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Bulk email to admins</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Database className="text-primary mb-2 block group-hover:scale-110 transition-transform size-6" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Vault Health</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Encryption status</p>
                </button>
            </div>
        </div>
    )
}
