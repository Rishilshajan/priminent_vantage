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

    const handleNext = () => {
        // Validation: Must have at least one task
        if (tasks.length === 0) {
            setError("You must create at least one task before proceeding.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Validation: At least one task must be "meaningful" (edited)
        const hasValidTask = tasks.some(t =>
            (t.title && !t.title.startsWith('New Task')) ||
            (t.introduction && t.introduction.trim().length > 0) ||
            (t.instructions && t.instructions.trim().length > 0)
        );

        if (!hasValidTask) {
            setError("Please configure at least one task with a valid title or instructions.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        onNext();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="text-slate-400">Loading...</span>
            </div>
        );
    }

    if (editingTask) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <button
                    onClick={() => setEditingTask(null)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Task List
                </button>

                <div className="bg-white dark:bg-slate-900 border border-primary/5 rounded-xl shadow-sm overflow-hidden">
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-full overflow-hidden">
            <section className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Task Configuration
                        </h2>
                        <p className="text-sm text-slate-500">
                            Define the sequence of tasks students must complete.
                        </p>
                    </div>
                    {/* Add Task Button (Top Right) */}
                    <Button
                        onClick={handleAddTask}
                        disabled={adding}
                        className="bg-primary text-white hover:bg-primary/90 shadow-sm"
                        size="sm"
                    >
                        <Plus size={16} className="mr-2" />
                        {adding ? 'Adding...' : 'Add Task'}
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertCircle size={18} />
                            <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                            <button onClick={() => setError(null)} className="ml-auto hover:text-red-800">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {tasks.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/10">
                            <div className="mx-auto size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No tasks defined yet</h3>
                            <p className="text-xs text-slate-500 mb-6">Start by adding your first simulation task.</p>
                            <Button
                                onClick={handleAddTask}
                                variant="outline"
                                disabled={adding}
                                className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                            >
                                <Plus size={16} className="mr-2" />
                                Create First Task
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {tasks.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => setEditingTask(task)}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary/40 hover:shadow-md transition-all cursor-pointer relative"
                                >
                                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors flex-1 break-words line-clamp-2">
                                                {task.title || 'Untitled Task'}
                                            </h4>
                                            {task.is_required && (
                                                <span className="shrink-0 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase tracking-wider border border-amber-100">
                                                    Required
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} />
                                                {task.estimated_time || '30m'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FileText size={12} />
                                                {task.deliverable_type || 'Text'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 w-full sm:w-auto sm:ml-auto">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center sm:justify-start gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => handleNext()} // Use wrapper to check validation
                        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center sm:justify-start gap-2"
                    >
                        Continue to Assessment
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
