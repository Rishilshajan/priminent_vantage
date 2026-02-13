"use client";

import { useState, useEffect } from "react";
import { getSimulation, addTask, updateTask, deleteTask } from "@/actions/simulations";
import { SimulationTask } from "@/lib/simulations";

interface TaskFlowBuilderProps {
    simulationId: string;
    onNext: () => void;
    onBack: () => void;
}

export default function TaskFlowBuilder({ simulationId, onNext, onBack }: TaskFlowBuilderProps) {
    const [tasks, setTasks] = useState<SimulationTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadTasks();
    }, [simulationId]);

    const loadTasks = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            setTasks(result.data.simulation_tasks || []);
        }
        setLoading(false);
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;

        setAdding(true);
        const result = await addTask(simulationId, {
            title: newTaskTitle,
            description: '',
        });

        if (!result.error && result.data) {
            setTasks(prev => [...prev, result.data!]);
            setNewTaskTitle('');
            setShowAddTask(false);
        }
        setAdding(false);
    };

    const handleMarkReady = async (taskId: string) => {
        const result = await updateTask(taskId, { status: 'ready' });
        if (!result.error) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ready' } : t));
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        const result = await deleteTask(taskId);
        if (!result.error) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><span className="text-slate-400">Loading...</span></div>;
    }

    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Task Flow Builder</h2>
                    <p className="text-sm text-slate-500">Create and manage simulation tasks.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {tasks.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-primary/5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="w-20 h-20 bg-primary/5 text-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl">account_tree</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Tasks Defined</h3>
                                <p className="text-xs text-slate-500 max-w-[240px] mx-auto">Build your simulation flow by adding structured tasks for candidates.</p>
                            </div>
                        ) : (
                            tasks.sort((a, b) => a.task_number - b.task_number).map((task, index) => (
                                <div
                                    key={task.id}
                                    className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                                                {String(task.task_number).padStart(2, '0')}
                                            </div>
                                            {task.status === 'ready' && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">{task.title}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-1 max-w-sm">{task.description || 'Define instructions for this task...'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`
                                            text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter
                                            ${task.status === 'ready'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}
                                        `}>
                                                {task.status === 'ready' ? 'Ready' : 'Draft'}
                                            </span>
                                            {task.status === 'incomplete' && (
                                                <button
                                                    onClick={() => handleMarkReady(task.id)}
                                                    className="text-[10px] font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-tight"
                                                >
                                                    Mark as Ready
                                                </button>
                                            )}
                                        </div>
                                        <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-700 mx-1" />
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add Task Button/Form */}
                        {showAddTask ? (
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-primary/20 shadow-xl shadow-primary/5 animate-in slide-in-from-top-2 duration-300">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">New Task Definition</h4>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                    placeholder="Enter a descriptive task title..."
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm p-4 mb-4 transition-all"
                                    autoFocus
                                />
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowAddTask(false);
                                            setNewTaskTitle('');
                                        }}
                                        className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTask}
                                        disabled={adding || !newTaskTitle.trim()}
                                        className="px-6 py-2.5 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center gap-2"
                                    >
                                        {adding ? (
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        )}
                                        {adding ? 'Creating...' : 'Create Task'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="w-full py-5 text-xs font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 hover:border-primary/30 transition-all flex items-center justify-center gap-3 group"
                            >
                                <span className="material-symbols-outlined group-hover:scale-125 transition-transform">add_circle</span>
                                Define New Simulation Task
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Metadata
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    Continue to Branding
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
