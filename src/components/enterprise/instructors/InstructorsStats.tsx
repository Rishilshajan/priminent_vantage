import React from 'react';
import { Users, Calendar, Star, TrendingUp } from 'lucide-react';

const InstructorsStats = () => {
    const stats = [
        {
            label: "Total Instructors",
            value: "124",
            change: "+5%",
            icon: "groups",
            trend: "up",
            bgColor: "bg-blue-50 dark:bg-blue-500/10",
            textColor: "text-blue-600"
        },
        {
            label: "Active Classes",
            value: "42",
            change: "+12%",
            icon: "event_available",
            trend: "up",
            bgColor: "bg-purple-50 dark:bg-primary/10",
            textColor: "text-primary"
        },
        {
            label: "Avg. Facilitator Rating",
            value: "4.8",
            subValue: "/ 5.0",
            icon: "star",
            trend: "neutral",
            bgColor: "bg-amber-50 dark:bg-amber-500/10",
            textColor: "text-amber-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 ${stat.bgColor} ${stat.textColor} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl font-bold">{stat.icon}</span>
                        </div>
                        {stat.change && (
                            <span className="text-emerald-500 text-[10px] font-black flex items-center gap-0.5 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <TrendingUp className="size-3" /> {stat.change}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                            {stat.subValue && <span className="text-slate-400 text-xs font-bold ml-1">{stat.subValue}</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InstructorsStats;
