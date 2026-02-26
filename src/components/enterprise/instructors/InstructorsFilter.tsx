import React from 'react';
import { Search, Filter, Download, Printer, ChevronDown } from 'lucide-react';

const InstructorsFilter = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm mb-6">
            <div className="flex gap-4 items-center flex-1 min-w-[300px]">
                <div className="relative flex-1 max-w-md group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-primary">search</span>
                    <input
                        className="w-full pl-12 pr-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Search instructors..."
                        type="text"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 h-11 px-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">layers</span>
                        <span>Simulation</span>
                        <ChevronDown className="size-4 opacity-30" />
                    </button>
                    <button className="flex items-center gap-2 h-11 px-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Status</span>
                        <ChevronDown className="size-4 opacity-30" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mr-1">Export</span>
                <button className="size-10 flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-primary shadow-sm" title="Download CSV">
                    <span className="material-symbols-outlined text-xl">download</span>
                </button>
                <button className="size-10 flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-primary shadow-sm" title="Print List">
                    <span className="material-symbols-outlined text-xl">print</span>
                </button>
            </div>
        </div>
    );
};

export default InstructorsFilter;
