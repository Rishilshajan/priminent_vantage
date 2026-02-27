import { MoreHorizontal } from "lucide-react"

export function TopPartners({ data }: { data: any[] }) {
    const maxEnrollments = data.length > 0 ? Math.max(...data.map(d => d.enrollments)) : 1;

    return (
        <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#3a2a4d] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#140d1b] dark:text-white">Top 5 Partners by Enrollment</h3>
                <button className="text-[#734c9a] dark:text-[#a682cc] hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
                    <MoreHorizontal className="size-4" />
                </button>
            </div>
            <div className="space-y-6">
                {data.length > 0 ? data.map((partner, idx) => {
                    const percentage = Math.round((partner.enrollments / maxEnrollments) * 100);
                    return (
                        <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#140d1b] dark:text-white truncate max-w-[200px]">{partner.name}</span>
                                <span className="text-[#140d1b] dark:text-white">{partner.enrollments.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-[#3a2a4d] rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-sm text-slate-400 italic text-center py-8">No partner enrollment data</p>
                )}
            </div>
        </div>
    )
}
