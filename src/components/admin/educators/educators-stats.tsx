import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface EducatorsStatsProps {
    stats: {
        totalEducators: number;
        activeGroups: number;
        studentsManaged: number;
        avgGroupSize: string;
        growth: {
            total: string;
            groups: string;
            students: string;
            avgSize: string;
        }
    };
    isLoading?: boolean;
}

export function EducatorsStats({ stats, isLoading }: EducatorsStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm animate-pulse">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3 mb-4"></div>
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Registered Educators</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">
                        {stats.totalEducators.toLocaleString()}
                    </span>
                    <span className={cn(
                        "text-sm font-semibold flex items-center",
                        stats.growth.total.startsWith('+') ? "text-green-600" : "text-red-500"
                    )}>
                        {stats.growth.total.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {stats.growth.total}
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Educator Groups</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">
                        {stats.activeGroups.toLocaleString()}
                    </span>
                    <span className={cn(
                        "text-sm font-semibold flex items-center",
                        stats.growth.groups.startsWith('+') ? "text-green-600" : "text-red-500"
                    )}>
                        {stats.growth.groups.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {stats.growth.groups}
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Students Managed</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">
                        {stats.studentsManaged.toLocaleString()}
                    </span>
                    <span className={cn(
                        "text-sm font-semibold flex items-center",
                        stats.growth.students.startsWith('+') ? "text-green-600" : "text-red-500"
                    )}>
                        {stats.growth.students.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {stats.growth.students}
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Avg. Group Size</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#140d1b] dark:text-white">
                        {stats.avgGroupSize}
                    </span>
                    <span className={cn(
                        "text-sm font-semibold flex items-center",
                        stats.growth.avgSize.startsWith('+') ? "text-green-600" : "text-red-500"
                    )}>
                        {stats.growth.avgSize.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {stats.growth.avgSize}
                    </span>
                </div>
            </div>
        </div>
    )
}
