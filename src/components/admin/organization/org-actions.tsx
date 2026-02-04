import { UserPlus, Contact, ClipboardCheck, Database } from "lucide-react"

export function OrgActions() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Management Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <UserPlus className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Manual Add</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Bypass request flow</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Contact className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Review Portal</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Manage external intake</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <ClipboardCheck className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Compliance</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Audit requirements</p>
                </button>
                <button className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-all text-left border border-slate-100 dark:border-slate-700 hover:border-primary/20 group">
                    <Database className="text-primary mb-2 block group-hover:scale-110 transition-transform size-8 font-light" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Vault Health</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Encryption status</p>
                </button>
            </div>
        </div>
    )
}
