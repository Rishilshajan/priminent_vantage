export function EducatorsFunnel() {
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
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Selected Course</span>
                    <span className="text-lg font-black pl-4">82%</span>
                </div>

                {/* Step 3 */}
                <div
                    className="flex-1 bg-primary/60 flex flex-col items-center justify-center text-white relative z-20 md:-ml-4 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Created Group</span>
                    <span className="text-lg font-black pl-4">64%</span>
                </div>

                {/* Step 4 */}
                <div
                    className="flex-1 bg-primary/40 flex flex-col items-center justify-center text-white relative z-10 md:-ml-4 py-4 md:py-0"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)", borderRadius: "0 0.5rem 0.5rem 0" }}
                >
                    <span className="text-xs font-bold opacity-80 uppercase tracking-wider pl-4">Invited Students</span>
                    <span className="text-lg font-black pl-4">51%</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-between mt-4 px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                <span>1,240 EDUCATORS</span>
                <span>1,016 ACTIVATED</span>
                <span>793 CREATORS</span>
                <span>632 ENGAGED</span>
            </div>
        </div>
    )
}
