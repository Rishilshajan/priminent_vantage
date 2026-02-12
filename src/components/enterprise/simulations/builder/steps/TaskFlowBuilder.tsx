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
                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">account_tree</span>
                            <p className="text-slate-500 mb-4">No tasks yet. Add your first task to get started.</p>
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className="p-4 bg-background-light dark:bg-slate-800 rounded-lg border border-primary/5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                        {String(task.task_number).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{task.title}</h4>
                                        <p className="text-xs text-slate-500">{task.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`
                                        text-[9px] font-extrabold px-2 py-1 rounded
                                        ${task.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                                    `}>
                                        {task.status === 'ready' ? 'READY' : 'INCOMPLETE'}
                                    </span>
                                    {task.status === 'incomplete' && (
                                        <button
                                            onClick={() => handleMarkReady(task.id)}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="material-symbols-outlined text-sm text-red-500 hover:text-red-700"
                                    >
                                        delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Add Task Button/Form */}
                    {showAddTask ? (
                        <div className="p-4 bg-background-light dark:bg-slate-800 rounded-lg border-2 border-dashed border-primary/20">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                placeholder="Enter task title..."
                                className="w-full bg-white dark:bg-slate-900 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3 mb-3"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddTask}
                                    disabled={adding || !newTaskTitle.trim()}
                                    className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {adding ? 'Adding...' : 'Add Task'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddTask(false);
                                        setNewTaskTitle('');
                                    }}
                                    className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddTask(true)}
                            className="w-full py-3 text-sm font-bold text-primary uppercase tracking-widest hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors"
                        >
                            + Add Task
                        </button>
                    )}
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
                    Back to Learning Outcomes
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    Continue to Certification
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
