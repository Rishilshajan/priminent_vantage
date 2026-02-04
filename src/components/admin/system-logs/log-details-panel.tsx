import { Braces, X, Copy, Share2, ChevronLeft } from "lucide-react"

export function LogDetailsPanel({ onClose }: { onClose: () => void }) {
    return (
        <aside className="fixed inset-y-0 right-0 z-40 w-full md:static md:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-y-auto shadow-2xl md:shadow-none">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="md:hidden p-1 -ml-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ChevronLeft className="size-5 text-slate-500" />
                        </button>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Braces className="text-primary size-5" />
                            Event Metadata
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="hidden md:block p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                        <X className="size-5 text-slate-400" />
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Selected Event</p>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Access Code Generated</h4>
                        <p className="text-xs text-slate-500 mt-1">ID: ev_82jks92mkdl0</p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">JSON Payload</p>
                        <div className="p-4 rounded-lg bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                            <pre>{`{
  "event_id": "ev_82jks92mkdl0",
  "version": "1.2.0",
  "timestamp": "2023-10-25T14:32:01.442Z",
  "actor": {
    "id": "usr_912",
    "name": "Marcus Chen",
    "role": "Super Admin",
    "ip": "10.0.42.15"
  },
  "action": "ACCESS_CODE_GENERATE",
  "params": {
    "org_id": "org_551",
    "org_name": "Hooli Ltd",
    "code_type": "alpha_numeric_9",
    "delivery": "email_smtp"
  },
  "result": {
    "status": "success",
    "generated_code": "HLX-492-WQV",
    "recipient": "admin@hooli.com"
  },
  "tags": ["security", "access", "onboarding"]
}`}</pre>
                        </div>
                    </div>
                    <div className="pt-4 space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <Copy className="size-4" />
                            Copy JSON
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <Share2 className="size-4" />
                            Share Log Trace
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
