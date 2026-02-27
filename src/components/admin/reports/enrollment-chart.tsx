import { Settings } from "lucide-react"

export function EnrollmentChart({ data }: { data: any[] }) {
    const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);
    const colors = ["#7f13ec", "#b064f5", "#d5b0fb", "#a686c7", "#ede7f3"];

    let currentOffset = 0;

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
                    <svg className="size-48 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ede7f3" strokeWidth="3" className="dark:stroke-[#3a2a4d]"></circle>
                        {data.map((item, idx) => {
                            const strokeDasharray = `${item.percentage} 100`;
                            const strokeDashoffset = `-${currentOffset}`;
                            currentOffset += item.percentage;
                            return (
                                <circle
                                    key={idx}
                                    cx="18"
                                    cy="18"
                                    fill="transparent"
                                    r="16"
                                    stroke={colors[idx % colors.length]}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeWidth="3"
                                ></circle>
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#140d1b] dark:text-white">
                            {totalCount > 1000 ? `${(totalCount / 1000).toFixed(1)}k` : totalCount}
                        </span>
                        <span className="text-[10px] text-[#734c9a] font-bold uppercase">Total</span>
                    </div>
                </div>
                <div className="flex-1 space-y-3 w-full sm:w-auto">
                    {data.length > 0 ? data.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                                <span className="text-[#734c9a] dark:text-[#a682cc] truncate max-w-[100px]">{item.name}</span>
                            </div>
                            <span className="font-bold text-[#140d1b] dark:text-white">{item.percentage}%</span>
                        </div>
                    )) : (
                        <p className="text-xs text-slate-400 italic">No industry data</p>
                    )}
                </div>
            </div>
        </div>
    )
}
