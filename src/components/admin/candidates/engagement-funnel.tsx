export function EngagementFunnel() {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-[#382a4a] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-[#382a4a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-[#140d1b] dark:text-white leading-tight">Engagement Conversion Funnel</h4>
                <span className="text-xs text-[#734c9a] dark:text-[#a682cc]">Last 30 Days</span>
            </div>
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-4">
                    {/* Stage 1 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <div className="text-xs font-bold text-[#734c9a] dark:text-[#a682cc] md:w-24 md:text-right">Registered</div>
                        <div className="bg-primary h-10 md:h-12 rounded-lg flex items-center px-4 justify-between relative shadow-sm w-full">
                            <span className="text-white text-sm font-bold">12,450</span>
                            <span className="text-white/70 text-[10px] uppercase font-bold">BASE</span>
                        </div>
                        <div className="hidden md:block w-16"></div>
                    </div>
                    {/* Stage 2 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <div className="text-xs font-bold text-[#734c9a] dark:text-[#a682cc] md:w-24 md:text-right flex justify-between md:block">
                            <span>Selected Course</span>
                            <span className="md:hidden text-red-500 font-bold text-xs">-18%</span>
                        </div>
                        <div className="flex-1 w-full md:px-[10%]">
                            <div className="bg-primary/80 h-10 md:h-12 rounded-lg flex items-center px-4 justify-between relative shadow-sm w-full">
                                <span className="text-white text-sm font-bold">10,210</span>
                                <span className="text-white/70 text-[10px] uppercase font-bold">82%</span>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 items-center text-red-500 font-bold text-xs">-18%</div>
                    </div>
                    {/* Stage 3 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <div className="text-xs font-bold text-[#734c9a] dark:text-[#a682cc] md:w-24 md:text-right flex justify-between md:block">
                            <span>Joined (Active)</span>
                            <span className="md:hidden text-red-500 font-bold text-xs">-11%</span>
                        </div>
                        <div className="flex-1 w-full md:px-[20%]">
                            <div className="bg-primary/60 h-10 md:h-12 rounded-lg flex items-center px-4 justify-between relative shadow-sm w-full">
                                <span className="text-white text-sm font-bold">8,920</span>
                                <span className="text-white/70 text-[10px] uppercase font-bold">71%</span>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 items-center text-red-500 font-bold text-xs">-11%</div>
                    </div>
                    {/* Stage 4 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <div className="text-xs font-bold text-[#734c9a] dark:text-[#a682cc] md:w-24 md:text-right flex justify-between md:block">
                            <span>Completed</span>
                            <span className="md:hidden text-red-500 font-bold text-xs">-23%</span>
                        </div>
                        <div className="flex-1 w-full md:px-[30%]">
                            <div className="bg-primary/40 h-10 md:h-12 rounded-lg flex items-center px-4 justify-between relative shadow-sm w-full">
                                <span className="text-white text-sm font-bold">6,083</span>
                                <span className="text-white/70 text-[10px] uppercase font-bold">48%</span>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 items-center text-red-500 font-bold text-xs">-23%</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
