import { useState, useEffect } from "react";
import { getSimulation, addTask, updateTask, deleteTask, reorderTasks } from "@/actions/simulations";
import { SimulationTask } from "@/lib/simulations";
import TaskEditor from "./TaskEditor";
import { Plus, Trash2, Check, LayoutGrid, Clock, ChevronRight, Settings2, ArrowLeft, GripVertical, FileText, MonitorPlay, Layers, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFlowBuilderProps {
    simulationId: string;
    onNext: () => void;
    onBack: () => void;
}

export default function TaskFlowBuilder({ simulationId, onNext, onBack }: TaskFlowBuilderProps) {
    const [tasks, setTasks] = useState<SimulationTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editingTask, setEditingTask] = useState<SimulationTask | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTasks();
    }, [simulationId]);

    const loadTasks = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            // Map legacy task_number/sort_order to order_index if needed
            const mappedTasks = (result.data.simulation_tasks || []).map((t: any) => ({
                ...t,
                order_index: t.order_index ?? t.task_number ?? t.sort_order ?? 1
            }));
            setTasks(mappedTasks);
        }
        setLoading(false);
    };

    const handleAddTask = async () => {
        setAdding(true);
        setError(null);

        // Calculate next order index
        const nextOrder = tasks.length > 0
            ? Math.max(...tasks.map(t => t.order_index || 0)) + 1
            : 1;

        const result = await addTask(simulationId, {
            title: `New Task ${nextOrder}`,
            order_index: nextOrder,
            deliverable_type: 'TEXT',
            unlock_condition: 'SEQUENTIAL',
            is_required: true,
        } as any);

        if (result.error) {
            setError(result.error);
        } else if (result.data) {
            const newTask = {
                ...result.data,
                order_index: result.data.order_index ?? nextOrder
            };
            setTasks(prev => [...prev, newTask]);
            // Auto-open editor for new task
            setEditingTask(newTask);
        }
        setAdding(false);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task? This cannot be undone.')) return;

        const result = await deleteTask(taskId);
        if (!result.error) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const handleTaskUpdate = (updatedTask: SimulationTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] space-y-6">
                <div className="relative">
                    <div className="size-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LayoutGrid size={24} className="text-primary/40" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Hydrating Task Flow</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Enterprise Simulation Builder v2.0</p>
                </div>
            </div>
        );
    }

    if (editingTask) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 min-h-screen">
                <button
                    onClick={() => setEditingTask(null)}
                    className="group flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 hover:text-primary transition-all pr-4 py-2"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:-translate-x-1 shadow-sm">
                        <ArrowLeft size={14} />
                    </div>
                    Back to Sequence
                </button>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[800px]">
                    <TaskEditor
                        task={editingTask}
                        onClose={() => setEditingTask(null)}
                        onUpdate={handleTaskUpdate}
                        inline
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex items-end justify-between px-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Layers size={18} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            Task Flow Builder
                            <span className="px-2.5 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest">v2.0</span>
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Design a professional, multi-stage learning path for your enterprise simulation.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                    <Check size={12} className="text-green-500" />
                    Draft Auto-Saved
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Task List / Kanban Style */}
            <section className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {tasks.length === 0 ? (
                        <div className="text-center py-32 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50/30 dark:bg-slate-800/10 group transition-all hover:bg-white dark:hover:bg-slate-800/20 hover:border-primary/20">
                            <div className="w-28 h-28 bg-white dark:bg-slate-800 text-slate-100 dark:text-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500 border border-slate-50 dark:border-slate-700">
                                <LayoutGrid size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Build Your First Task</h3>
                            <p className="text-sm text-slate-400 max-w-[340px] mx-auto mb-10 font-medium leading-relaxed">Every great enterprise simulation starts with a structured set of challenges. Define your first task to get started.</p>
                            <Button
                                onClick={handleAddTask}
                                disabled={adding}
                                className="h-14 px-10 rounded-2xl bg-slate-900 text-white hover:bg-primary transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/10"
                            >
                                <Plus size={18} className="mr-2" />
                                {adding ? 'Initializing...' : 'Define First Task'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => setEditingTask(task)}
                                    className="group relative p-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="flex items-center gap-8 p-4">
                                        {/* Task Counter */}
                                        <div className="relative">
                                            <div className="size-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:bg-primary/5 group-hover:text-primary flex items-center justify-center font-black text-3xl transition-all shadow-inner border border-slate-100/50 dark:border-white/5">
                                                {String(task.order_index || index + 1).padStart(2, '0')}
                                            </div>
                                            {task.status === 'ready' && (
                                                <div className="absolute -top-2 -right-2 size-8 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                                                    <Check size={16} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Preview */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary/60">
                                                <span>Task {task.order_index || index + 1}</span>
                                                {task.is_required && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[9px] border border-amber-100/50">Core Requirement</span>}
                                            </div>
                                            <h4 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-primary transition-colors pr-10">{task.title || 'Untitled Task'}</h4>

                                            <div className="flex items-center gap-6 pt-1">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Clock size={14} className="text-slate-300" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{task.estimated_time || '30-60 mins'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <FileText size={14} className="text-slate-300" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{task.deliverable_type || 'TEXT'} Submission</span>
                                                </div>
                                                {task.video_url && (
                                                    <div className="flex items-center gap-2 text-blue-400">
                                                        <MonitorPlay size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Video Briefing</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-4 pr-6">
                                            <div className={`
                                                text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all
                                                ${task.status === 'ready'
                                                    ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800'
                                                    : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}
                                            `}>
                                                {task.status === 'ready' ? 'Ready to Launch' : 'Drafting'}
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTask(task.id);
                                                }}
                                                className="size-12 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all group-hover:translate-x-1 shadow-sm border border-slate-100 dark:border-slate-800">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Secondary Add Task Button */}
                            <button
                                onClick={handleAddTask}
                                disabled={adding}
                                className="w-full py-10 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 text-slate-300 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all flex flex-col items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.3em] group"
                            >
                                <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 group-hover:rotate-90 transition-all shadow-sm">
                                    <Plus size={24} />
                                </div>
                                {adding ? 'Creating Task Architecture...' : 'Define Another Task'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Global Navigation */}
            <div className="flex items-center justify-between py-12 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onBack}
                    className="group px-10 py-5 text-xs font-black border-2 border-slate-100 dark:border-slate-800 text-slate-500 rounded-3xl hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 transition-all flex items-center gap-3 uppercase tracking-widest shadow-sm"
                >
                    <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Metadata
                </button>

                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                        {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Defined
                    </p>
                    <button
                        type="button"
                        onClick={onNext}
                        className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-2xl transition-all flex items-center gap-4 group hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Continue to Branding
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
