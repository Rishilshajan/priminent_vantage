import { Settings } from "lucide-react"

export function EnrollmentChart() {
    return (
        <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#3a2a4d] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#140d1b] dark:text-white">Enrollment by Industry</h3>
                <button className="text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
                    <Settings className="size-4" />
                </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center sm:justify-start">
                <div className="relative size-48 shrink-0">
                    {/* Mock Doughnut Chart SVG */}
                    <svg className="size-48 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ede7f3" strokeWidth="3" className="dark:stroke-[#3a2a4d]"></circle>
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#7f13ec" strokeDasharray="40 100" strokeWidth="3"></circle>
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#b064f5" strokeDasharray="25 100" strokeDashoffset="-40" strokeWidth="3"></circle>
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#d5b0fb" strokeDasharray="20 100" strokeDashoffset="-65" strokeWidth="3"></circle>
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#a686c7" strokeDasharray="15 100" strokeDashoffset="-85" strokeWidth="3"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#140d1b] dark:text-white">45.2k</span>
                        <span className="text-[10px] text-[#734c9a] font-bold uppercase">Total</span>
                    </div>
                </div>
                <div className="flex-1 space-y-3 w-full sm:w-auto">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-primary"></div>
                            <span className="text-[#734c9a] dark:text-[#a682cc]">Technology</span>
                        </div>
                        <span className="font-bold text-[#140d1b] dark:text-white">40%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#b064f5]"></div>
                            <span className="text-[#734c9a] dark:text-[#a682cc]">Finance</span>
                        </div>
                        <span className="font-bold text-[#140d1b] dark:text-white">25%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#d5b0fb]"></div>
                            <span className="text-[#734c9a] dark:text-[#a682cc]">Healthcare</span>
                        </div>
                        <span className="font-bold text-[#140d1b] dark:text-white">20%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#a686c7]"></div>
                            <span className="text-[#734c9a] dark:text-[#a682cc]">Others</span>
                        </div>
                        <span className="font-bold text-[#140d1b] dark:text-white">15%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
