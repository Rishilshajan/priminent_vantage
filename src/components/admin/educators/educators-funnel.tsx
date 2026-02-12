interface EducatorsFunnelProps {
    data: {
        total: number;
        approved: number;
        creators: number;
        engaged: number;
    };
    isLoading?: boolean;
}

export function EducatorsFunnel({ data, isLoading }: EducatorsFunnelProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8 animate-pulse">
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-6"></div>
                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded w-full mb-4"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
            </div>
        )
    }

    const approvedPct = data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0;
    const creatorsPct = data.total > 0 ? Math.round((data.creators / data.total) * 100) : 0;
    const engagedPct = data.total > 0 ? Math.round((data.engaged / data.total) * 100) : 0;

    return (
        <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm mb-8">
            <h3 className="text-lg font-bold mb-6 text-[#140d1b] dark:text-white">Educator Activity Funnel</h3>

            <div className="flex flex-col md:flex-row w-full md:h-16 relative gap-2 md:gap-0">

                {/* Step 1 */}
                <div
                    className="flex-1 bg-primary flex flex-col items-center justify-center text-white relative z-40 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)", borderRadius: "0.5rem 0 0 0.5rem" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Signed Up</span>
                    <span className="text-lg font-black">100%</span>
                </div>

                {/* Step 2 */}
                <div
                    className="flex-1 bg-primary/80 flex flex-col items-center justify-center text-white relative z-30 md:-ml-4 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Approved</span>
                    <span className="text-lg font-black pl-4">{approvedPct}%</span>
                </div>

                {/* Step 3 */}
                <div
                    className="flex-1 bg-primary/60 flex flex-col items-center justify-center text-white relative z-20 md:-ml-4 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Created content</span>
                    <span className="text-lg font-black pl-4">{creatorsPct}%</span>
                </div>

                {/* Step 4 */}
                <div
                    className="flex-1 bg-primary/40 flex flex-col items-center justify-center text-white relative z-10 md:-ml-4 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)", borderRadius: "0 0.5rem 0.5rem 0" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Active Engagement</span>
                    <span className="text-lg font-black pl-4">{engagedPct}%</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-between mt-4 px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                <span>{data.total.toLocaleString()} EDUCATORS</span>
                <span>{data.approved.toLocaleString()} ACTIVATED</span>
                <span>{data.creators.toLocaleString()} CREATORS</span>
                <span>{data.engaged.toLocaleString()} ENGAGED</span>
            </div>
        </div>
    )
}
