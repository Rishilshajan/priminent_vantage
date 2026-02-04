import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function LogTable({ onSelectLog, selectedLogId }: { onSelectLog: (id: string) => void, selectedLogId?: string | null }) {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[1000px] text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider z-10">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Timestamp</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Level</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Actor</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Event Type</th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Detailed Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr
                            className={cn("transition-colors cursor-pointer group", selectedLogId === "1" ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}
                            onClick={() => onSelectLog("1")}
                        >
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">2023-10-25 14:32:01</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase">Success</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">MC</div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">Marcus Chen</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Access Code Generated</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">Generated unique 9-digit code HLX-492-WQV for Hooli Ltd enterprise onboarding.</p>
                            </td>
                        </tr>

                        <tr
                            className={cn("transition-colors cursor-pointer group bg-slate-50/30 dark:bg-slate-800/20", selectedLogId === "2" ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}
                            onClick={() => onSelectLog("2")}
                        >
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">2023-10-25 14:15:44</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase">Warning</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">S</div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">System</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Login Attempt Failed</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">IP 192.168.1.104 failed authentication for user 'admin_backup'. Lockout timer initialized.</p>
                            </td>
                        </tr>

                        <tr
                            className={cn("transition-colors cursor-pointer group", selectedLogId === "3" ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}
                            onClick={() => onSelectLog("3")}
                        >
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">2023-10-25 13:58:22</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase">Error</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">MC</div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">Marcus Chen</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vault Decryption Error</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">Unable to decrypt organization secrets for 'Acme Corp'. Check HSM connectivity.</p>
                            </td>
                        </tr>

                        <tr
                            className={cn("transition-colors cursor-pointer group", selectedLogId === "4" ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}
                            onClick={() => onSelectLog("4")}
                        >
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">2023-10-25 13:40:00</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase">Success</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">S</div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">System</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Org Created</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">New organization 'Cyberdyne Systems' successfully added to the database.</p>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing logs from last 24 hours (128 total entries)</p>
                <div className="flex gap-1">
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <ChevronLeft className="size-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">2</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">3</button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
