import { Briefcase, CheckCircle2, BarChart3, Clock, Trophy, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    simulation: any;
    activeTaskIndex: number;
    setActiveTaskIndex: (index: number) => void;
    submissions: any[];
    primaryBgStyle: any;
    getTaskStatus: (taskId: string, index: number) => 'completed' | 'available' | 'locked';
}

export function Sidebar({
    simulation,
    activeTaskIndex,
    setActiveTaskIndex,
    submissions,
    primaryBgStyle,
    getTaskStatus
}: SidebarProps) {

    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden md:flex shrink-0">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    {simulation.org_logo_url ? (
                        <img src={simulation.org_logo_url} alt={simulation.organization_name} className="size-8 rounded-lg object-contain" />
                    ) : (
                        <div className="size-8 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                            <Briefcase className="size-4 text-slate-400" />
                        </div>
                    )}
                    <h2 className="font-bold text-xs truncate max-w-[180px] text-slate-900 dark:text-white uppercase tracking-tight">{simulation.organization_name}</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-12">
                <nav className="relative">
                    <div className="absolute left-[20px] top-6 bottom-6 w-[1.5px] bg-slate-100 dark:bg-slate-800" />
                    <div className="space-y-12">
                        {simulation.tasks.map((task: any, index: number) => {
                            const status = getTaskStatus(task.id, index);
                            const isActive = index === activeTaskIndex;
                            const isLocked = status === 'locked';

                            return (
                                <div
                                    key={task.id}
                                    onClick={() => !isLocked && setActiveTaskIndex(index)}
                                    className={cn(
                                        "relative z-10 flex gap-4 group transition-all",
                                        isLocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex-shrink-0 size-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-[1.5px]",
                                            isActive
                                                ? "text-white shadow-xl"
                                                : status === 'completed'
                                                    ? "bg-white dark:bg-slate-900 border-green-500 text-green-500"
                                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 group-hover:border-slate-400"
                                        )}
                                        style={isActive ? primaryBgStyle : {}}
                                    >
                                        {status === 'completed' ? (
                                            <CheckCircle2 className="size-4" />
                                        ) : index + 1}
                                    </div>

                                    <div className="pt-0.5 flex-1 min-w-0">
                                        <h3 className={cn(
                                            "text-sm font-bold truncate transition-colors",
                                            isActive ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                        )}>
                                            Task {index + 1}
                                        </h3>
                                        {isActive && (
                                            <p className="text-[11px] text-slate-900 dark:text-white font-bold mt-1 line-clamp-2 leading-tight">
                                                {task.title}
                                            </p>
                                        )}
                                        <div className="flex flex-col gap-1 mt-2">
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <BarChart3 className="size-2.5" />
                                                {task.difficulty_level || 'Intermediate'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <Clock className="size-2.5" />
                                                {task.estimated_time || '1 hour'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </div>

            <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-black dark:hover:border-white transition-all group">
                    <div className="flex items-center gap-3 text-left">
                        <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Trophy className="size-4 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Achievements</p>
                            <p className="text-[9px] text-slate-400 font-medium">0 / 4 Unlocked</p>
                        </div>
                    </div>
                    <ChevronDown className="size-4 text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </button>
            </div>
        </aside>
    );
}
