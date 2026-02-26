"use client";

import { useState, useEffect, useRef } from "react";
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
    Layers,
    CheckCircle2,
    Code2,
    Terminal,
    AlertCircle,
    ShieldCheck
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
    saveTrigger?: number;
    onSaveSuccess?: () => void;
}

const ESTIMATED_TIME_OPTIONS = [
    "30–60 mins",
    "1–2 hours",
    "2–4 hours",
    "Custom"
];

const DIFFICULTY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
];

const DELIVERABLE_TYPES = [
    { id: 'text', label: 'Text Submission', icon: Type, description: 'Student writes a response in a text editor' },
    { id: 'file_upload', label: 'File Upload', icon: FileUp, description: 'Student uploads a PDF, DOCX, or other file' },
    { id: 'mcq', label: 'Multiple Choice', icon: ListChecks, description: 'Auto-graded quiz with options' },
    { id: 'code_snippet', label: 'Code Editor', icon: Code2, description: 'Code editor with syntax highlighting' },
];

interface DeliverableType {
    id: string;
    label: string;
    icon: any;
    description: string;
    disabled?: boolean;
}


const PROGRAMMING_LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'sql', label: 'SQL' },
];

export default function TaskEditor({ task, onClose, onUpdate, inline, saveTrigger, onSaveSuccess }: TaskEditorProps) {
    const [formData, setFormData] = useState<Partial<SimulationTask>>({
        ...task,
        description: task.description || task.introduction || "",
        estimated_duration: task.estimated_duration || task.estimated_time || "30–60 mins",
        submission_type: task.submission_type || (task.deliverable_type?.toLowerCase() as any) || 'text',
        supporting_docs: task.supporting_docs || (task.attachments?.map(a => ({ name: a.file_name, url: a.file_url, type: a.file_type })) || []),
        unlock_condition: task.unlock_condition || 'SEQUENTIAL',
        what_you_do: task.what_you_do || "",
        welcome_video_url: task.welcome_video_url || null,
        scenario_context: task.scenario_context || "",
        difficulty_level: task.difficulty_level || "beginner",
        internal_notes: task.internal_notes || "",
        dataset_url: task.dataset_url || "",
        pdf_brief_url: task.pdf_brief_url || "",
        submission_instructions: task.submission_instructions || "",
    });

    // MCQ State
    const [quizData, setQuizData] = useState<any[]>(task.quiz_data || []);

    // Code Snippet State
    const [codeConfig, setCodeConfig] = useState<{ language: string; starter_code?: string }>(
        task.code_config || { language: 'javascript', starter_code: '' }
    );

    const [saving, setSaving] = useState(false);
    const [saveSource, setSaveSource] = useState<'global' | 'local_publish' | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    // Video Assets State
    const [videoAssets, setVideoAssets] = useState<{ title: string; url: string; type: 'upload' | 'embed' }[]>(
        task.video_assets || (task.video_url ? [{ title: 'Main Video', url: task.video_url, type: 'embed' }] : [])
    );
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [customMinutes, setCustomMinutes] = useState("");

    const [error, setError] = useState<string | null>(null);

    const lastSaveTrigger = useRef(saveTrigger || 0);

    // Listen for global save trigger
    useEffect(() => {
        if (saveTrigger && saveTrigger > lastSaveTrigger.current) {
            handleSave({ status: formData.status || 'incomplete', shouldClose: false, source: 'global' });
            lastSaveTrigger.current = saveTrigger;
        }
    }, [saveTrigger]);

    const handleSave = async (options: { status?: 'ready' | 'incomplete', shouldClose?: boolean, source?: 'global' | 'local_publish' } = {}) => {
        // Prevent saving if already in progress or if uploading a file
        if (saving) return;

        if (uploading || uploadingVideo) {
            setError("Please wait for all uploads to complete before saving.");
            return;
        }

        setSaving(true);
        if (options.source) setSaveSource(options.source);
        setError(null);

        // Prepare final data strictly matching Database/Schema columns
        const finalData: Partial<SimulationTask> = {
            ...formData,
            status: options.status || formData.status || 'incomplete',
            estimated_duration: formData.estimated_duration === 'Custom' ? `${customMinutes} mins` : formData.estimated_duration,
            video_url: videoAssets.length > 0 ? videoAssets[0].url : null,
            video_assets: videoAssets,
            quiz_data: quizData,
            code_config: codeConfig,
            supporting_docs: formData.supporting_docs || [],
        };

        try {
            const result = await updateTask(task.id, finalData as any);

            if (result.error) {
                setError(result.error);
                setSaving(false);
                return;
            }

            if (result.data) {
                onUpdate(result.data);
                if (options.shouldClose) {
                    onClose();
                } else if (onSaveSuccess) {
                    onSaveSuccess();
                }
            }
        } catch (err) {
            setError('An unexpected error occurred while saving.');
            console.error(err);
        } finally {
            setSaving(false);
        }
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
                supporting_docs: [...(prev.supporting_docs || []), {
                    name: file.name,
                    url: result.data.url,
                    type: file.type || 'document'
                }]
            }));
        }
        setUploading(false);
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (e.g., max 300MB)
        if (file.size > 300 * 1024 * 1024) {
            setError("Video file is too large. Maximum size is 300MB.");
            return;
        }

        setUploadingVideo(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('simulationId', task.simulation_id);
        uploadData.append('taskId', task.id);
        uploadData.append('assetType', 'video');

        try {
            const result = await uploadAsset(uploadData);

            if (!result.error && result.data) {
                setFormData(prev => ({
                    ...prev,
                    welcome_video_url: result.data.url
                }));
            } else {
                setError(result.error || "Failed to upload video.");
            }
        } catch (err) {
            setError("An error occurred during video upload.");
        } finally {
            setUploadingVideo(false);
        }
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            supporting_docs: (prev.supporting_docs || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-950 ${!inline ? 'fixed inset-0 z-50 animate-in slide-in-from-right duration-500' : ''}`}>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between sticky top-0 z-20">
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

            {/* Error Message */}
            {error && (
                <div className="mx-8 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center justify-between gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
                <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
                    {/* SECTION 1: BASIC INFORMATION */}
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
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
                                    value={formData.estimated_duration || undefined}
                                    onValueChange={val => setFormData(prev => ({ ...prev, estimated_duration: val }))}
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

                            {formData.estimated_duration === 'Custom' && (
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

                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Difficulty Level</label>
                                <Select
                                    value={formData.difficulty_level || "Beginner"}
                                    onValueChange={val => setFormData(prev => ({ ...prev, difficulty_level: val }))}
                                >
                                    <SelectTrigger className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3 h-auto">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIFFICULTY_LEVELS.map(level => (
                                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Task Overview
                            </h2>
                            <p className="text-sm text-slate-500">
                                Student-facing introduction. Set the stage for the task.
                            </p>
                        </div>
                        <div className="space-y-8">
                            {/* Welcome Video Upload */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome Video</label>
                                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                        <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">AWS S3 Secure Storage</span>
                                    </div>
                                </div>
                                {formData.welcome_video_url ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-video max-w-md">
                                        <video
                                            src={formData.welcome_video_url}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, welcome_video_url: null }))}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center p-8 bg-slate-50/20 dark:bg-slate-800/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group max-w-md">
                                        <div className="size-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                                            {uploadingVideo ? <div className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Video size={24} />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 mt-4">Click to upload welcome video</span>
                                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-black">MP4, WebM (Max 300MB)</span>
                                        <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} />
                                    </label>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Scenario Context (Optional)</label>
                                <RichTextEditor
                                    value={formData.scenario_context || ""}
                                    onChange={(val: string) => setFormData(prev => ({ ...prev, scenario_context: val }))}
                                    placeholder="Set the workplace scene or situation..."
                                    minHeight="140px"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">What students will do</label>
                                <RichTextEditor
                                    value={formData.what_you_do || ""}
                                    onChange={(val: string) => setFormData(prev => ({ ...prev, what_you_do: val }))}
                                    placeholder="Describe the main activities students will perform..."
                                    minHeight="140px"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Task Description / Introduction (Rich Text)</label>
                                <RichTextEditor
                                    value={formData.description || ""}
                                    onChange={(val: string) => setFormData(prev => ({ ...prev, description: val }))}
                                    placeholder="Write a professional introduction..."
                                    minHeight="180px"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: LEARNING OBJECTIVES */}
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
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
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
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
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
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
                                    {(formData.supporting_docs || []).map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 group">
                                            <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                                <FileUp size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black">{file.type?.split('/')[1] || 'FILE'}</p>
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
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Video Resources (YouTube, Loom)</label>

                                {/* List of Added Videos */}
                                <div className="space-y-3 mb-4">
                                    {videoAssets.map((video, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-red-500 shadow-sm">
                                                <Video size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{video.title || 'Video Resource'}</p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black truncate">{video.url}</p>
                                            </div>
                                            <button
                                                onClick={() => setVideoAssets(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Video Input */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newVideoUrl}
                                            onChange={e => setNewVideoUrl(e.target.value)}
                                            className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                            placeholder="Paste YouTube or Loom URL"
                                        />
                                        <button
                                            onClick={() => {
                                                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                                                const loomRegex = /^(https?:\/\/)?(www\.)?loom\.com\/share\/.+$/;

                                                if (youtubeRegex.test(newVideoUrl) || loomRegex.test(newVideoUrl)) {
                                                    // Valid case
                                                    const provider = youtubeRegex.test(newVideoUrl) ? 'YouTube Video' : 'Loom Video';
                                                    setVideoAssets(prev => [...prev, {
                                                        title: provider,
                                                        url: newVideoUrl,
                                                        type: 'embed'
                                                    }]);
                                                    setNewVideoUrl(""); // Clear input

                                                    // Visual Feedback (optional)
                                                    const btn = document.getElementById('add-video-btn');
                                                    if (btn) {
                                                        btn.textContent = 'Added!';
                                                        setTimeout(() => { btn.textContent = 'Add Video'; }, 2000);
                                                    }
                                                } else {
                                                    // Invalid case
                                                    const btn = document.getElementById('add-video-btn');
                                                    if (btn) {
                                                        const originalText = btn.textContent;
                                                        btn.textContent = 'Invalid URL';
                                                        btn.classList.add('bg-red-500', 'text-white');
                                                        setTimeout(() => {
                                                            btn.textContent = 'Add Video';
                                                            btn.classList.remove('bg-red-500', 'text-white');
                                                        }, 2000);
                                                    }
                                                }
                                            }}
                                            id="add-video-btn"
                                            className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs font-bold whitespace-nowrap"
                                        >
                                            Add Video
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 pl-1">
                                        Supported: YouTube, Loom. Videos are not downloaded, only linked.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: DELIVERABLE TYPE */}
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
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
                                {DELIVERABLE_TYPES.map((type: any) => (
                                    <button
                                        key={type.id}
                                        disabled={type.disabled}
                                        onClick={() => setFormData(prev => ({ ...prev, submission_type: type.id as any }))}
                                        className={`
                                            flex flex-col p-4 rounded-xl border-2 transition-all text-left
                                            ${formData.submission_type === type.id
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                            }
                                            ${type.disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <type.icon size={18} className={formData.submission_type === type.id ? 'text-primary' : 'text-slate-400'} />
                                            <span className={`text-sm font-bold ${formData.submission_type === type.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {type.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* MCQ BUILDER */}
                            {formData.submission_type === 'mcq' && (
                                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Questions</label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuizData([...quizData, { question: '', options: ['', ''], answer: 0 }])}
                                            className="h-8 text-xs gap-2"
                                        >
                                            <Plus size={14} /> Add Question
                                        </Button>
                                    </div>

                                    {quizData.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                            No questions added yet. Click "Add Question" to start.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {quizData.map((q, qIdx) => (
                                                <div key={qIdx} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                                                    <button
                                                        onClick={() => setQuizData(quizData.filter((_, i) => i !== qIdx))}
                                                        className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-xs text-slate-400 font-bold mb-1 block">Question {qIdx + 1}</label>
                                                            <Input
                                                                value={q.question}
                                                                onChange={(e) => {
                                                                    const newData = [...quizData];
                                                                    newData[qIdx].question = e.target.value;
                                                                    setQuizData(newData);
                                                                }}
                                                                placeholder="Enter question here..."
                                                                className="font-medium"
                                                            />
                                                        </div>
                                                        <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                                                            {q.options.map((opt: string, oIdx: number) => (
                                                                <div key={oIdx} className="flex items-center gap-3">
                                                                    <div
                                                                        onClick={() => {
                                                                            const newData = [...quizData];
                                                                            newData[qIdx].answer = oIdx;
                                                                            setQuizData(newData);
                                                                        }}
                                                                        className={`cursor-pointer size-5 rounded-full border flex items-center justify-center transition-all ${q.answer === oIdx ? 'border-primary bg-primary text-white' : 'border-slate-300 text-transparent hover:border-primary'}`}
                                                                    >
                                                                        <CheckCircle2 size={12} />
                                                                    </div>
                                                                    <Input
                                                                        value={opt}
                                                                        onChange={(e) => {
                                                                            const newData = [...quizData];
                                                                            newData[qIdx].options[oIdx] = e.target.value;
                                                                            setQuizData(newData);
                                                                        }}
                                                                        placeholder={`Option ${oIdx + 1}`}
                                                                        className="h-9 text-sm"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const newData = [...quizData];
                                                                            newData[qIdx].options = newData[qIdx].options.filter((_: any, i: number) => i !== oIdx);
                                                                            if (q.answer === oIdx) newData[qIdx].answer = 0;
                                                                            setQuizData(newData);
                                                                        }}
                                                                        className="text-slate-300 hover:text-red-500"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newData = [...quizData];
                                                                    newData[qIdx].options.push('');
                                                                    setQuizData(newData);
                                                                }}
                                                                className="h-6 text-xs text-primary hover:text-primary/80 px-2 mt-2"
                                                            >
                                                                + Add Option
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CODE SNIPPET BUILDER */}
                            {formData.submission_type === 'code_snippet' && (
                                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <Terminal size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Code Environment Configuration</h4>
                                            <p className="text-xs text-slate-500">Setup the coding challenge environment</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language</label>
                                            <Select
                                                value={codeConfig.language}
                                                onValueChange={(val) => setCodeConfig(prev => ({ ...prev, language: val }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROGRAMMING_LANGUAGES.map(lang => (
                                                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Starter Code (Optional)</label>
                                            <div className="relative">
                                                <textarea
                                                    value={codeConfig.starter_code || ''}
                                                    onChange={(e) => setCodeConfig(prev => ({ ...prev, starter_code: e.target.value }))}
                                                    className="w-full h-48 bg-slate-900 text-slate-50 font-mono text-sm p-4 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                                                    placeholder="// Write starter code here..."
                                                />
                                                <div className="absolute top-2 right-2 text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                                                    {codeConfig.language}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                    {/* SECTION 8: ACCESS & VISIBILITY */}
                    <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-xl border border-primary/5 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Access & Visibility
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Control how and when this task becomes available to students.
                                </p>
                            </div>
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
                                            flex flex-col p-5 rounded-xl border-2 transition-all text-left h-full
                                            ${formData.unlock_condition === opt.id
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-bold ${formData.unlock_condition === opt.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                                            {opt.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 9: INSTRUCTOR ONLY */}
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/10 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                            <ShieldCheck size={160} className="text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="size-2 rounded-full bg-primary" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Instructor Notes
                                    </h2>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Confidential notes for administrators and instructors. Not visible to students.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <textarea
                                    value={formData.internal_notes || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, internal_notes: e.target.value }))}
                                    className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-4 text-slate-600 dark:text-slate-300 font-mono transition-all"
                                    placeholder="Enter internal implementation notes, evaluation criteria, or solution keys..."
                                />
                                <div className="flex items-center gap-2 text-primary/60 text-[10px] font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full w-fit border border-primary/10">
                                    <AlertCircle size={12} />
                                    <span>Private Administrator Field</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 md:px-8 md:py-6 flex items-center justify-between sticky bottom-0 z-20 shadow-sm">
                <button
                    onClick={onClose}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                    Discard Changes
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSave({ status: 'ready', shouldClose: true, source: 'local_publish' })}
                        disabled={saving || uploading}
                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-semibold"
                    >
                        {uploading ? "Uploading..." : (saving && saveSource === 'local_publish' ? "Saving..." : "Publish & Return")}
                        {!uploading && !saving && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                        {uploading && <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
