import { MoreHorizontal } from "lucide-react"

export function TopPartners() {
    return (
        <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#3a2a4d] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#140d1b] dark:text-white">Top 5 Partners by Enrollment</h3>
                <button className="text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
                    <MoreHorizontal className="size-4" />
                </button>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#140d1b] dark:text-white">Amazon Inc</span>
                        <span className="text-[#140d1b] dark:text-white">12,890</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "100%" }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#140d1b] dark:text-white">Nvidia Corp</span>
                        <span className="text-[#140d1b] dark:text-white">8,420</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#140d1b] dark:text-white">Google Cloud</span>
                        <span className="text-[#140d1b] dark:text-white">7,100</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "55%" }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#140d1b] dark:text-white">JP Morgan</span>
                        <span className="text-[#140d1b] dark:text-white">5,200</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "40%" }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#140d1b] dark:text-white">Goldman Sachs</span>
                        <span className="text-[#140d1b] dark:text-white">3,150</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "24%" }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
