import { useState, useEffect } from "react";
import { getSimulation, addTask, updateTask, deleteTask, reorderTasks } from "@/actions/simulations";
import { SimulationTask, Simulation } from "@/lib/simulations";
import TaskEditor from "./TaskEditor";
import { Plus, Trash2, Check, LayoutGrid, Clock, ChevronRight, Settings2, ArrowLeft, GripVertical, FileText, MonitorPlay, Layers, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFlowBuilderProps {
    simulationId: string;
    initialData?: Simulation | null;
    onNext: () => void;
    onBack: () => void;
    saveTrigger?: number;
    onSaveSuccess?: () => void;
}

export default function TaskFlowBuilder({ simulationId, initialData, onNext, onBack, saveTrigger, onSaveSuccess }: TaskFlowBuilderProps) {
    const [tasks, setTasks] = useState<SimulationTask[]>([]);
    const [loading, setLoading] = useState(!!simulationId && !initialData);
    const [adding, setAdding] = useState(false);
    const [editingTask, setEditingTask] = useState<SimulationTask | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (simulationId && !initialData) {
            loadTasks();
        } else if (initialData) {
            mapAndSetTasks(initialData.simulation_tasks || []);
            setLoading(false);
        }
    }, [simulationId, initialData]);

    // Handle global save trigger when NOT editing a task
    useEffect(() => {
        if (saveTrigger && saveTrigger > 0 && !editingTask && onSaveSuccess) {
            // If we are just viewing the list, there's nothing specific to save here locally,
            // so we immediately signal success to clear the "Saving..." state.
            onSaveSuccess();
        }
    }, [saveTrigger, editingTask, onSaveSuccess]);

    const mapAndSetTasks = (tasksToMap: any[]) => {
        const mappedTasks = tasksToMap.map((t: any) => ({
            ...t,
            order_index: t.order_index ?? t.task_number ?? t.sort_order ?? 1
        }));
        setTasks(mappedTasks);
    };

    const loadTasks = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            mapAndSetTasks(result.data.simulation_tasks || []);
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
        if (onSaveSuccess) onSaveSuccess();
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
            <div className="animate-in fade-in slide-in-from-right-12 duration-700 min-h-screen">
                <button
                    onClick={() => setEditingTask(null)}
                    className="group flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 hover:text-primary transition-all pr-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-full border border-slate-100/50 dark:border-slate-800/50 w-fit shadow-sm"
                >
                    <div className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all group-hover:-translate-x-1.5 shadow-md">
                        <ArrowLeft size={16} strokeWidth={3} />
                    </div>
                    Back to Strategy Sequence
                </button>

                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-[4rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.08)] dark:shadow-none min-h-[900px] animate-in zoom-in-95 duration-700">
                    <TaskEditor
                        task={editingTask}
                        onClose={() => setEditingTask(null)}
                        onUpdate={handleTaskUpdate}
                        inline
                        saveTrigger={saveTrigger}
                        onSaveSuccess={onSaveSuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex items-end justify-between px-6 pb-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm border border-primary/10">
                            <Layers size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Task Sequence
                                </h2>
                                <span className="px-3 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10">v2.0</span>
                            </div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Settings2 size={12} />
                                Enterprise Strategic Architecture
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50/50 dark:bg-green-900/10 px-5 py-2.5 rounded-2xl border border-green-100/50 dark:border-green-900/20 shadow-sm animate-in fade-in zoom-in duration-700">
                    <Check size={14} className="text-green-500" strokeWidth={3} />
                    Ready for Deployment
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-6 p-5 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-3xl flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-red-900/5">
                    <div className="size-10 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto size-10 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Task List / Kanban Style */}
            <section className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    {tasks.length === 0 ? (
                        <div className="text-center py-40 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] bg-slate-50/30 dark:bg-slate-800/5 group transition-all duration-700 hover:bg-white dark:hover:bg-slate-800/10 hover:border-primary/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
                            <div className="w-32 h-32 bg-white dark:bg-slate-800 text-slate-100 dark:text-slate-700 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-slate-50 dark:border-slate-700 relative z-10">
                                <LayoutGrid size={56} className="group-hover:text-primary transition-colors duration-700" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight relative z-10">Initialize Your Strategy</h3>
                            <p className="text-base text-slate-400 max-w-[400px] mx-auto mb-12 font-medium leading-relaxed relative z-10 px-6">Every high-impact simulation is built upon a foundation of structured challenges. Define your first phase to begin.</p>
                            <Button
                                onClick={handleAddTask}
                                disabled={adding}
                                className="h-16 px-12 rounded-[1.5rem] bg-slate-900 text-white hover:bg-primary transition-all duration-500 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:shadow-primary/40 relative z-10 hover:-translate-y-1"
                            >
                                <Plus size={20} className="mr-3" />
                                {adding ? 'Provisioning Architecture...' : 'Initialize Phase 01'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tasks.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => setEditingTask(task)}
                                    className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-none transition-all duration-500 cursor-pointer overflow-hidden p-1"
                                >
                                    <div className="flex items-center gap-8 p-6">
                                        {/* Task Counter */}
                                        <div className="relative">
                                            <div className="size-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:bg-primary/5 group-hover:text-primary flex items-center justify-center font-black text-4xl transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-white/5">
                                                {String(task.order_index || index + 1).padStart(2, '0')}
                                            </div>
                                            {task.status === 'ready' && (
                                                <div className="absolute -top-3 -right-3 size-10 bg-green-500 text-white rounded-2xl flex items-center justify-center border-[6px] border-white dark:border-slate-900 shadow-xl scale-110 group-hover:scale-125 transition-transform duration-500">
                                                    <Check size={18} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Preview */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-3 py-1 rounded-full">
                                                    Phase {task.order_index || index + 1}
                                                </span>
                                                {task.is_required && (
                                                    <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100/50">
                                                        Mandatory
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-black text-2xl text-slate-800 dark:text-white group-hover:text-primary transition-colors pr-10 tracking-tight leading-tight">
                                                {task.title || 'Untitled Strategic Task'}
                                            </h4>

                                            <div className="flex items-center gap-8 pt-2">
                                                <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                                    <div className="size-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                                        <Clock size={14} className="text-slate-400" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{task.estimated_time || '30-60 mins'}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                                    <div className="size-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                                        <FileText size={14} className="text-slate-400" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{task.deliverable_type || 'TEXT'} Submission</span>
                                                </div>
                                                {task.video_url && (
                                                    <div className="flex items-center gap-2.5 text-blue-500/60 group-hover:text-blue-500 transition-colors">
                                                        <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <MonitorPlay size={14} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Multimedia Brief</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-4 pr-6">
                                            <div className={`
                                                text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-[0.15em] border-2 transition-all duration-500
                                                ${task.status === 'ready'
                                                    ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800 shadow-sm'
                                                    : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}
                                            `}>
                                                {task.status === 'ready' ? 'Ready to Deploy' : 'In Development'}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(task.id);
                                                    }}
                                                    className="size-14 rounded-[1.25rem] flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all border-2 border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 size={22} />
                                                </button>
                                                <div className="size-14 rounded-[1.25rem] bg-slate-100/50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500 group-hover:translate-x-1 shadow-sm border-2 border-transparent group-hover:border-primary/20">
                                                    <ChevronRight size={24} />
                                                </div>
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
            <div className="flex items-center justify-between py-10 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onBack}
                    className="group px-7 py-3.5 text-[10px] font-black border-2 border-slate-100 dark:border-slate-800 text-slate-500 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 transition-all flex items-center gap-2.5 uppercase tracking-[0.2em] shadow-sm"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Learning Outcomes
                </button>

                <div className="flex items-center gap-8">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] hidden md:block">
                        {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Created
                    </p>
                    <button
                        type="button"
                        onClick={onNext}
                        className="px-10 py-4.5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:opacity-95 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.2)] transition-all flex items-center gap-4 group hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5"
                    >
                        Continue to Assessment & Submission
                        <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
