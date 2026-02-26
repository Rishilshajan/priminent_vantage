"use client";

import { useEffect, useState } from "react";
import { getSimulation } from "@/actions/simulations";
import { SimulationTask } from "@/lib/simulations";

interface TaskMapSidebarProps {
    simulationId: string;
}

export default function TaskMapSidebar({ simulationId }: TaskMapSidebarProps) {
    const [tasks, setTasks] = useState<SimulationTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, [simulationId]);

    const loadTasks = async () => {
        setLoading(true);
        const result = await getSimulation(simulationId);
        if (result.data) {
            setTasks(result.data.simulation_tasks || []);
        }
        setLoading(false);
    };

    const completedTasks = tasks.filter(t => t.status === 'ready').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <aside className="w-80 flex-shrink-0 border-l border-primary/10 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-primary/5 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Simulation Map
                </h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-1 rounded">
                    {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                </span>
            </div>

            {/* Task Timeline */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <span className="text-sm text-slate-400">Loading tasks...</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2">
                            account_tree
                        </span>
                        <p className="text-sm text-slate-400">No tasks yet</p>
                        <p className="text-xs text-slate-400 mt-1">Add tasks in Step 4</p>
                    </div>
                ) : (
                    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/10">
                        {tasks.map((task, index) => (
                            <div key={task.id} className="relative">
                                {/* Timeline Dot */}
                                <div className={`
                                    absolute -left-[30px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 z-10
                                    ${task.status === 'ready' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}
                                `}>
                                    <span className="text-[10px] font-bold">
                                        {String(task.task_number).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Task Card */}
                                <div className={`
                                    p-4 rounded-xl border group hover:border-primary/30 transition-all cursor-pointer
                                    ${task.status === 'ready'
                                        ? 'bg-background-light dark:bg-slate-800/50 border-primary/5'
                                        : 'bg-white dark:bg-slate-900 border-2 border-dashed border-primary/20'
                                    }
                                `}>
                                    <h4 className={`
                                        text-xs font-bold mb-1
                                        ${task.status === 'ready'
                                            ? 'text-slate-900 dark:text-white'
                                            : 'text-slate-400'
                                        }
                                    `}>
                                        {task.title}
                                    </h4>
                                    <p className={`
                                        text-[10px] line-clamp-2
                                        ${task.status === 'ready'
                                            ? 'text-slate-500'
                                            : 'text-slate-400 italic'
                                        }
                                    `}>
                                        {task.description || 'Configuration pending...'}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        <span className={`
                                            text-[9px] font-extrabold px-1.5 py-0.5 rounded
                                            ${task.status === 'ready'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }
                                        `}>
                                            {task.status === 'ready' ? 'READY' : 'INCOMPLETE'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Progress Footer */}
            <div className="p-6 bg-primary/5 border-t border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        A complete simulation typically includes 4-6 tasks to ensure depth of assessment.
                    </p>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase   er">
                        Current Progress
                    </span>
                    <span className="text-[9px] font-bold text-primary uppercase   er">
                        {progress}% Complete
                    </span>
                </div>
            </div>
        </aside>
    );
}
