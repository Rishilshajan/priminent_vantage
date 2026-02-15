"use client";

import { useState, useEffect } from "react";
import { SimulationTask } from "@/lib/simulations";
import { updateTask, uploadAsset } from "@/actions/simulations";
import {
    Save,
    X,
    Plus,
    Trash2,
    FileUp,
    Video,
    ListChecks,
    Type,
    Eye,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import RichTextEditor from "../RichTextEditor";

interface TaskEditorProps {
    task: SimulationTask;
    onClose: () => void;
    onUpdate: (updatedTask: SimulationTask) => void;
    inline?: boolean;
}

const ESTIMATED_TIME_OPTIONS = [
    "30–60 mins",
    "1–2 hours",
    "2–4 hours",
    "Custom"
];

const DELIVERABLE_TYPES = [
    { id: 'TEXT', label: 'Text Submission', icon: Type, description: 'Student writes a response in a text editor' },
    { id: 'FILE_UPLOAD', label: 'File Upload', icon: FileUp, description: 'Student uploads a PDF, DOCX, or other file' },
    { id: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: ListChecks, description: 'Coming Soon', disabled: true },
    { id: 'CODE_SNIPPET', label: 'Code Snippet', icon: Layers, description: 'Coming Soon', disabled: true },
    { id: 'REFLECTION_ONLY', label: 'Reflection Only', icon: Eye, description: 'Coming Soon', disabled: true },
];

export default function TaskEditor({ task, onClose, onUpdate, inline }: TaskEditorProps) {
    const [formData, setFormData] = useState<Partial<SimulationTask>>({
        ...task,
        learning_objectives: task.learning_objectives || task.what_you_learn || [],
        attachments: task.attachments || (task.supporting_docs?.map(d => ({ file_name: d.name, file_url: d.url, file_type: 'document' })) || []),
        estimated_time: task.estimated_time || task.estimated_duration || "30–60 mins",
        deliverable_type: task.deliverable_type || (task.submission_type?.toUpperCase() as any) || 'TEXT',
        unlock_condition: task.unlock_condition || 'SEQUENTIAL',
        introduction: task.introduction || task.description || "",
    });

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [videoLink, setVideoLink] = useState(task.video_url || "");
    const [customMinutes, setCustomMinutes] = useState("");

    const handleSave = async (options: { status?: 'ready' | 'incomplete', shouldClose?: boolean } = {}) => {
        setSaving(true);
        // Prepare final data
        const finalData = {
            ...formData,
            status: options.status || formData.status || 'incomplete',
            estimated_time: formData.estimated_time === 'Custom' ? `${customMinutes} mins` : formData.estimated_time,
            video_url: videoLink,
        };

        const result = await updateTask(task.id, finalData as any);
        if (!result.error && result.data) {
            onUpdate(result.data);
            if (options.shouldClose && !inline) {
                onClose();
            } else if (options.shouldClose && inline) {
                // If inline and we should close, it means we return to the list
                onClose();
            }
        }
        setSaving(false);
    };

    const addLearningObjective = () => {
        setFormData(prev => ({
            ...prev,
            learning_objectives: [...(prev.learning_objectives || []), ""]
        }));
    };

    const updateLearningObjective = (index: number, value: string) => {
        const updated = [...(formData.learning_objectives || [])];
        updated[index] = value;
        setFormData(prev => ({ ...prev, learning_objectives: updated }));
    };

    const removeLearningObjective = (index: number) => {
        setFormData(prev => ({
            ...prev,
            learning_objectives: (prev.learning_objectives || []).filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('simulationId', task.simulation_id);
        uploadData.append('taskId', task.id);
        uploadData.append('assetType', 'document');

        const result = await uploadAsset(uploadData);

        if (!result.error && result.data) {
            setFormData(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), {
                    file_name: file.name,
                    file_url: result.data.url,
                    file_type: file.type || 'document'
                }]
            }));
        }
        setUploading(false);
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-950 ${!inline ? 'fixed inset-0 z-50 animate-in slide-in-from-right duration-500' : ''}`}>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                        {String(task.order_index || task.task_number || 1).padStart(2, '0')}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Task Editor</h2>
                        <p className="text-xs text-slate-500">Editing: {task.title}</p>
                    </div>
                </div>
                {!inline && (
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
                <div className="max-w-5xl mx-auto p-8 space-y-8">
                    {/* SECTION 1: BASIC INFORMATION */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Basic Information
                            </h2>
                            <p className="text-sm text-slate-500">
                                Define the task identity, duration and basic metadata for students.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Task Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                    placeholder="Enter task title"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Time</label>
                                <Select
                                    value={formData.estimated_time || undefined}
                                    onValueChange={val => setFormData(prev => ({ ...prev, estimated_time: val }))}
                                >
                                    <SelectTrigger className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3 h-auto">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ESTIMATED_TIME_OPTIONS.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.estimated_time === 'Custom' && (
                                <div className="col-span-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Minutes</label>
                                    <input
                                        type="number"
                                        value={customMinutes}
                                        onChange={e => setCustomMinutes(e.target.value)}
                                        className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                        placeholder="e.g. 45"
                                    />
                                </div>
                            )}

                            <div className="col-span-2 flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    checked={formData.is_required}
                                    onChange={e => setFormData(prev => ({ ...prev, is_required: e.target.checked }))}
                                    className="w-5 h-5 text-primary rounded border-primary/20 focus:ring-primary"
                                />
                                <div className="flex-1">
                                    <label htmlFor="is_required" className="block text-sm font-bold text-slate-900 dark:text-white">
                                        Required Task
                                    </label>
                                    <p className="text-xs text-slate-500">
                                        Students must complete this task to proceed with the simulation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2: TASK OVERVIEW */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Task Overview
                            </h2>
                            <p className="text-sm text-slate-500">
                                Student-facing introduction. Set the stage for the task.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Introduction (Rich Text)</label>
                            <RichTextEditor
                                value={formData.introduction || ""}
                                onChange={(val: string) => setFormData(prev => ({ ...prev, introduction: val }))}
                                placeholder="Write a professional introduction..."
                                minHeight="180px"
                            />
                        </div>
                    </section>

                    {/* SECTION 3: LEARNING OBJECTIVES */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Learning Objectives
                            </h2>
                            <p className="text-sm text-slate-500">
                                What skills or knowledge will students gain? (Min. 1 required)
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                {(formData.learning_objectives || []).map((obj, idx) => (
                                    <div key={idx} className="flex gap-3 group animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex-1 bg-background-light dark:bg-slate-800/50 rounded-lg flex items-center px-4 gap-3 border border-primary/10 transition-all">
                                            <span className="text-primary font-bold text-xs">{idx + 1}.</span>
                                            <input
                                                value={obj}
                                                onChange={e => updateLearningObjective(idx, e.target.value)}
                                                className="h-12 w-full bg-transparent outline-none text-sm font-semibold"
                                                placeholder="e.g. Design modular API architectures"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeLearningObjective(idx)}
                                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addLearningObjective}
                                className="w-full h-12 rounded-lg border-dashed border-2 border-primary/20 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Learning Objective
                            </button>
                        </div>
                    </section>

                    {/* SECTION 4: TASK INSTRUCTIONS */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Detailed Instructions
                            </h2>
                            <p className="text-sm text-slate-500">
                                Core workplace-style instructions. Be detailed and clear.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Step-by-Step Guide</label>
                            <RichTextEditor
                                value={formData.instructions || ""}
                                onChange={(val: string) => setFormData(prev => ({ ...prev, instructions: val }))}
                                placeholder="Provide step-by-step instructions..."
                                minHeight="350px"
                            />
                        </div>
                    </section>

                    {/* SECTION 5: SUPPORTING MATERIALS */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Supporting Materials
                            </h2>
                            <p className="text-sm text-slate-500">
                                Upload briefings, datasets, or link video resources.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">File Attachments</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(formData.attachments || []).map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 group">
                                            <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                                <FileUp size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.file_name}</p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black">{file.file_type.split('/')[1] || 'FILE'}</p>
                                            </div>
                                            <button onClick={() => removeAttachment(idx)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center py-6 bg-slate-50/20 dark:bg-slate-800/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group">
                                        <div className="size-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                                            {uploading ? <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Plus size={20} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Upload File</span>
                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Video Resource (YouTube, Loom)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={videoLink}
                                        onChange={e => setVideoLink(e.target.value)}
                                        className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                        placeholder="Paste host URL"
                                    />
                                    <button className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs font-bold">
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: DELIVERABLE TYPE */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Student Submission
                            </h2>
                            <p className="text-sm text-slate-500">
                                What must the student submit to complete this task?
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {DELIVERABLE_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        disabled={type.disabled}
                                        onClick={() => setFormData(prev => ({ ...prev, deliverable_type: type.id as any }))}
                                        className={`
                                            flex flex-col p-4 rounded-xl border-2 transition-all text-left
                                            ${formData.deliverable_type === type.id
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                            }
                                            ${type.disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <type.icon size={18} className={formData.deliverable_type === type.id ? 'text-primary' : 'text-slate-400'} />
                                            <span className={`text-sm font-bold ${formData.deliverable_type === type.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {type.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Submission Instructions (Rich Text)</label>
                                <RichTextEditor
                                    value={formData.submission_instructions || ""}
                                    onChange={(val: string) => setFormData(prev => ({ ...prev, submission_instructions: val }))}
                                    placeholder="e.g. Please ensure your PDF is clear..."
                                    minHeight="140px"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 7: INTERNAL NOTES */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm overflow-hidden relative">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Internal Admin Notes
                            </h2>
                            <p className="text-sm text-slate-500">
                                Admin only notes. Guidance for evaluators and grading rubrics.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Grading Rubric & Guidance</label>
                            <RichTextEditor
                                value={formData.internal_notes || ""}
                                onChange={(val: string) => setFormData(prev => ({ ...prev, internal_notes: val }))}
                                placeholder="Add specific grading criteria..."
                                minHeight="180px"
                            />
                        </div>
                    </section>

                    {/* SECTION 8: ACCESS & VISIBILITY */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Access & Visibility
                            </h2>
                            <p className="text-sm text-slate-500">
                                Control how and when this task becomes available to students.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Unlock Condition</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: 'SEQUENTIAL', label: 'Sequential', description: 'Requires previous task completion' },
                                    { id: 'ALWAYS_OPEN', label: 'Always Open', description: 'Available at any time' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, unlock_condition: opt.id as any }))}
                                        className={`
                                            flex flex-col p-4 rounded-xl border-2 transition-all text-left
                                            ${formData.unlock_condition === opt.id
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-primary/20 bg-background-light dark:bg-slate-800/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-bold ${formData.unlock_condition === opt.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {opt.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-6 flex items-center justify-between sticky bottom-0 z-20 shadow-sm">
                <button
                    onClick={onClose}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                    Discard Changes
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSave({ status: 'incomplete', shouldClose: false })}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold border border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave({ status: 'ready', shouldClose: true })}
                        disabled={saving}
                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-semibold"
                    >
                        {saving ? "Saving..." : "Publish & Return"}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
