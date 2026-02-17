"use client"

export default function CoreCompetencies() {
    return (
        <div className="card-container bg-white dark:bg-[#1f1629] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Core Competencies</h4>
                    <p className="text-xs text-slate-400 font-medium">Skill frequency across the talent pool</p>
                </div>
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4">Full Matrix</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
                <div className="aspect-square bg-[#F5F3FF] dark:bg-primary/5 border border-primary/10 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-primary/60 uppercase">Python</span>
                    <span className="text-sm font-bold text-primary">92%</span>
                </div>
                <div className="aspect-square bg-[#FAF5FF] dark:bg-primary/5 border border-primary/5 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-primary/60 uppercase">Analysis</span>
                    <span className="text-sm font-bold text-primary">88%</span>
                </div>
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Logic</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">74%</span>
                </div>
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Comm.</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">62%</span>
                </div>
                <div className="aspect-square bg-[#FDF4FF] dark:bg-primary/5 border border-primary/5 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-primary/60 uppercase">SQL</span>
                    <span className="text-sm font-bold text-primary">81%</span>
                </div>
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 text-center opacity-60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Strategy</span>
                    <span className="text-sm font-bold text-slate-500">45%</span>
                </div>
                <div className="aspect-square bg-[#F5F3FF] dark:bg-primary/5 border border-primary/10 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-primary/60 uppercase">Cloud</span>
                    <span className="text-sm font-bold text-primary">94%</span>
                </div>
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Design</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">68%</span>
                </div>
            </div>
        </div>
    )
}
