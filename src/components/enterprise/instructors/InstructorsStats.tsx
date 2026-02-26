import React from 'react';
import { Users, Calendar, Star, TrendingUp } from 'lucide-react';

interface InstructorsStatsProps {
    stats?: {
        totalSpecialists: number;
        pendingInvitations: number;
        activePrograms: number;
    };
}

const InstructorsStats = ({ stats }: InstructorsStatsProps) => {
    const statsConfig = [
        {
            label: "Total Specialists",
            value: stats?.totalSpecialists.toString() || "0",
            icon: "groups",
            bgColor: "bg-blue-50 dark:bg-blue-500/10",
            textColor: "text-blue-600"
        },
        {
            label: "Pending Invitations",
            value: stats?.pendingInvitations.toString() || "0",
            icon: "mail",
            bgColor: "bg-purple-50 dark:bg-primary/10",
            textColor: "text-primary"
        },
        {
            label: "Active Simulations",
            value: stats?.activePrograms.toString() || "0",
            icon: "layers",
            bgColor: "bg-amber-50 dark:bg-amber-500/10",
            textColor: "text-amber-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm dark:hover:shadow-none transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 ${stat.bgColor} ${stat.textColor} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl font-bold">{stat.icon}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white   ">{stat.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InstructorsStats;
