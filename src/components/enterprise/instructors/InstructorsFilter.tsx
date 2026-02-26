import React, { useState } from 'react';
import { ChevronDown, Search, Download, Printer, CheckCircle2 } from 'lucide-react';

interface InstructorsFilterProps {
    onSearchChange: (query: string) => void;
    onStatusFilterChange: (status: string) => void;
    currentStatus: string;
    onExport: () => void;
}

const InstructorsFilter = ({
    onSearchChange,
    onStatusFilterChange,
    currentStatus,
    onExport
}: InstructorsFilterProps) => {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statuses = ["All", "Active", "Pending", "Inactive"];

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm mb-6">
            <div className="flex gap-4 items-center flex-1 min-w-[300px]">
                <div className="relative flex-1 max-w-md group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-primary">search</span>
                    <input
                        className="w-full pl-12 pr-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                        placeholder="Search instructors by name or email..."
                        type="text"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className={`flex items-center gap-2 h-11 px-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isStatusOpen ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'bg-white dark:bg-slate-950 text-slate-500'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            <span>{currentStatus === 'All' ? 'Status' : currentStatus}</span>
                            <ChevronDown className={`size-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isStatusOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            onStatusFilterChange(status);
                                            setIsStatusOpen(false);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${currentStatus === status ? 'text-primary' : 'text-slate-500'
                                            }`}
                                    >
                                        {status}
                                        {currentStatus === status && <div className="size-1.5 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mr-1">Export</span>
                <button
                    onClick={onExport}
                    className="size-10 flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-primary shadow-sm"
                    title="Download CSV"
                >
                    <span className="material-symbols-outlined text-xl">download</span>
                </button>
            </div>
        </div>
    );
};

export default InstructorsFilter;
