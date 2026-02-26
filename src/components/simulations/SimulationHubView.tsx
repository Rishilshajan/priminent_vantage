"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    Layers,
    LayoutDashboard,
    Briefcase,
    Bell,
    BookOpen,
    FlaskConical,
    Play,
    Trophy,
    ArrowRight,
    Clock,
    BarChart3,
    Moon,
    Sun,
    ChevronDown,
    Activity,
    LogOut,
    Settings,
    User,
    Users,
    CheckCircle2,
    Presentation,
    Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentHeader } from "@/components/student/StudentHeader";
import { submitTaskAction } from "@/actions/student/simulation_hub.actions";

interface SimulationHubViewProps {
    simulation: any;
    userData: any;
    orgBranding: {
        brand_color: string | null;
        logo_url: string | null;
    };
    submissions: any[];
}

type DeliverableType = 'text' | 'mcq' | 'file' | 'code';

export function SimulationHubView({ simulation, userData, orgBranding, submissions }: SimulationHubViewProps) {
    const router = useRouter();
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);

    // Derived state
    const activeTask = simulation.tasks[activeTaskIndex] || (simulation.tasks.length > 0 ? simulation.tasks[0] : null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Submission States
    const [submissionText, setSubmissionText] = useState("");
    const [submissionCode, setSubmissionCode] = useState("");
    const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
    const [uploadedFile, setUploadedFile] = useState<any>(null);

    // Initialize starter code when task changes
    useEffect(() => {
        if (activeTask?.deliverable_type === 'code' && activeTask.code_config?.starter_code) {
            setSubmissionCode(activeTask.code_config.starter_code);
        } else {
            setSubmissionCode("");
        }
    }, [activeTaskIndex, activeTask]);

    const brandColorText = orgBranding.brand_color ? { color: orgBranding.brand_color } : {};
    const brandColorBg = orgBranding.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorBorder = orgBranding.brand_color ? { borderColor: orgBranding.brand_color } : {};

    const handleSubmit = async () => {
        if (!activeTask) return;

        setIsSubmitting(true);
        setStatusMessage(null);

        let finalSubmissionData: any = {
            submitted_at: new Date().toISOString(),
            type: activeTask.deliverable_type || 'file'
        };

        // Populate data based on type
        const type = (activeTask.deliverable_type || 'file').toLowerCase();
        if (type === 'text') {
            if (submissionText.trim().length < 50) {
                setStatusMessage({ type: 'error', text: "Please provide a more detailed response (min 50 characters)." });
                setIsSubmitting(false);
                return;
            }
            finalSubmissionData.content = submissionText;
        } else if (type === 'mcq') {
            const questions = activeTask.submission_config?.questions || [];
            if (Object.keys(mcqAnswers).length < questions.length) {
                setStatusMessage({ type: 'error', text: "Please answer all questions before submitting." });
                setIsSubmitting(false);
                return;
            }
            finalSubmissionData.answers = mcqAnswers;
        } else if (type === 'code') {
            if (!submissionCode.trim()) {
                setStatusMessage({ type: 'error', text: "Please provide your code snippet." });
                setIsSubmitting(false);
                return;
            }
            finalSubmissionData.code = submissionCode;
        } else {
            // Default/File
            finalSubmissionData.file = uploadedFile || { status: 'mock_uploaded' };
        }

        try {
            const result = await submitTaskAction(simulation.id, activeTask.id, finalSubmissionData);
            if (result.success) {
                setStatusMessage({ type: 'success', text: "Deliverable submitted successfully!" });
                // Reset states
                setSubmissionText("");
                setSubmissionCode("");
                setMcqAnswers({});
                setUploadedFile(null);

                // Move to next task
                setTimeout(() => {
                    if (activeTaskIndex < simulation.tasks.length - 1) {
                        setActiveTaskIndex(prev => prev + 1);
                        setStatusMessage(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 1500);
            } else {
                setStatusMessage({ type: 'error', text: result.error || "Failed to submit task" });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Find submissions for tasks
    const getTaskStatus = (taskId: string, index: number) => {
        const submission = submissions?.find(s => s.task_id === taskId);
        if (submission) return 'completed';

        // Sequential unlocking logic
        if (simulation.unlock_condition === 'SEQUENTIAL' && index > 0) {
            const previousTask = simulation.tasks[index - 1];
            const prevSubmission = submissions?.find(s => s.task_id === previousTask.id);
            if (!prevSubmission) return 'locked';
        }

        return index === activeTaskIndex ? 'active' : 'ready';
    };

    // Find the video asset for the active task
    const activeTaskVideo = simulation.assets?.find((a: any) => a.asset_type === 'video' && a.task_id === activeTask?.id);
    const supervisorVideo = activeTaskVideo || simulation.assets?.find((a: any) => a.asset_type === 'video' && !a.task_id);

    if (!activeTask) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center p-8">
                <LayoutDashboard className="size-12 text-slate-300 mb-4" />
                <h1 className="text-xl font-bold">No tasks found for this simulation.</h1>
                <Link href="/student/dashboard" className="text-primary hover:underline mt-4">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans">
            <StudentHeader userData={userData} orgBranding={orgBranding} />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            {simulation.org_logo_url ? (
                                <img src={simulation.org_logo_url} alt={simulation.organization_name} className="size-10 rounded-lg object-contain" />
                            ) : (
                                <div className="size-10 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                                    <Briefcase className="size-5 text-slate-400" />
                                </div>
                            )}
                            <div>
                                <h2 className="font-bold text-sm truncate max-w-[180px]">{simulation.organization_name}</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold truncate max-w-[180px]">
                                    {simulation.title}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 relative">
                        {/* Roadmap Line */}
                        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-slate-100 dark:bg-slate-800" />

                        <div className="space-y-4">
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
                                            isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex-shrink-0 size-12 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                                            isActive
                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                : status === 'completed'
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-primary/50"
                                        )} style={isActive ? brandColorBg : status === 'completed' ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}>
                                            {status === 'completed' ? '✓' : index + 1}
                                        </div>
                                        <div className="pt-1.5 flex-1 min-w-0">
                                            <h3 className={cn(
                                                "text-sm font-bold truncate transition-colors",
                                                isActive ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-primary"
                                            )} style={isActive ? brandColorText : {}}>
                                                Task {task.task_number || index + 1}
                                            </h3>
                                            {(isActive || status === 'completed') && (
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {task.title}
                                                </p>
                                            )}
                                            <div className="flex gap-3 mt-1.5">
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                                    <BarChart3 className="size-3" /> {task.difficulty_level || simulation.difficulty_level || 'Intermediate'}
                                                </span>
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                                    <Clock className="size-3" /> {task.estimated_time || task.estimated_duration || '1-2h'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </nav>
                </aside>

                {/* Main Workspace Area */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar pb-32">
                    {/* Hero Section of Task */}
                    <div className="relative py-16 px-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 bg-primary/5 rounded-full blur-3xl" style={orgBranding.brand_color ? { backgroundColor: `${orgBranding.brand_color}0d` } : {}} />

                        <div className="max-w-4xl mx-auto relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary" style={orgBranding.brand_color ? { backgroundColor: `${orgBranding.brand_color}1a`, color: orgBranding.brand_color, borderColor: `${orgBranding.brand_color}22` } : {}}>
                                    Phase {activeTaskIndex + 1}
                                </div>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                                {activeTask.title}
                            </h1>

                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
                                {activeTask.description || "The task objective will be revealed in the briefing documentation below."}
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto py-12 px-8 space-y-20 pb-32">
                        {/* Project Introduction */}
                        <section className="space-y-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8 lg:p-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-1 w-8 rounded-full" style={brandColorBg} />
                                <h2 className="font-display text-2xl font-black tracking-tight">Project Introduction</h2>
                            </div>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{ __html: activeTask.introduction || activeTask.description }}
                                />
                            </div>

                            {activeTask.scenario_context && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] p-8 mt-10 shadow-sm">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
                                        <BarChart3 className="size-5 text-primary" style={brandColorText} /> Client Scenario Context
                                    </h3>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{ __html: activeTask.scenario_context }}
                                    />
                                </div>
                            )}

                            {(activeTask.attachments || []).length > 0 && (
                                <div className="mt-10 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resources & Attachments</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeTask.attachments.map((file: any, idx: number) => (
                                            <a
                                                key={idx}
                                                href={file.file_url || file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all group shadow-sm"
                                            >
                                                <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                    {file.file_type?.includes('video') || file.type === 'embed' ? <Play className="size-5" /> : <BookOpen className="size-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{file.file_name || file.title || 'Attached Resource'}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{file.file_type || file.type || 'Document'}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        <div className="flex flex-col gap-8">
                            <section className="space-y-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8 lg:p-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <h2 className="font-display text-2xl font-black tracking-tight">What you'll learn</h2>
                                </div>
                                <div className="grid gap-6">
                                    {(activeTask.learning_objectives || activeTask.what_you_learn || []).map((objective: any, i: number) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex-shrink-0 size-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="size-4 text-green-500" />
                                            </div>
                                            <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed pt-0.5">
                                                {objective.text || objective}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8 lg:p-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <h2 className="font-display text-2xl font-black tracking-tight">What you'll do</h2>
                                </div>
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <div className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{ __html: activeTask.what_you_do || activeTask.instructions }}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Deliverable Section */}
                        <section className="space-y-8 pt-12 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="font-display text-2xl font-black tracking-tight mb-2">Your Deliverable</h2>
                                    <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full inline-block">
                                        Type: {activeTask.deliverable_type || activeTask.submission_type || 'Self-Paced'}
                                    </p>
                                </div>

                                {getTaskStatus(activeTask.id, activeTaskIndex) !== 'completed' && (
                                    <div className="flex gap-4">
                                        {activeTask.pdf_brief_url && (
                                            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 transition-colors">
                                                <Presentation className="size-4" /> Download Brief
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div
                                className={cn(
                                    "bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] p-8 lg:p-12 text-center group transition-all",
                                    isSubmitting && "opacity-50 cursor-wait",
                                    !activeTask.deliverable_type || activeTask.deliverable_type === 'file' ? "cursor-pointer hover:border-primary/50" : ""
                                )}
                                style={brandColorBorder}
                            >
                                <div className="max-w-3xl mx-auto">
                                    <div className="size-20 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={orgBranding.brand_color ? { backgroundColor: `${orgBranding.brand_color}0d` } : {}}>
                                        {isSubmitting ? (
                                            <Activity className="size-10 text-primary animate-pulse" style={brandColorText} />
                                        ) : (
                                            <Upload className="size-10 text-primary" style={brandColorText} />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-display font-black mb-4">
                                        {isSubmitting ? "Processing Submission..." : "Ready to submit?"}
                                    </h3>
                                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium leading-relaxed prose dark:prose-invert mx-auto">
                                        {activeTask.submission_instructions ? (
                                            <div dangerouslySetInnerHTML={{ __html: activeTask.submission_instructions }} />
                                        ) : (
                                            <p>Complete the requirements below to submit your deliverable.</p>
                                        )}
                                    </div>

                                    {/* Dynamic Input Areas */}
                                    <div className="mb-10 text-left">
                                        {activeTask.deliverable_type === 'text' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Response</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{submissionText.split(/\s+/).filter(Boolean).length} Words</span>
                                                </div>
                                                <textarea
                                                    value={submissionText}
                                                    onChange={(e) => setSubmissionText(e.target.value)}
                                                    placeholder="Type your structured response here..."
                                                    className="w-full h-64 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-slate-700 dark:text-slate-300 font-medium leading-relaxed resize-none"
                                                />
                                            </div>
                                        )}

                                        {activeTask.deliverable_type === 'code' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Code Implementation</span>
                                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                                                            {activeTask.code_config?.language || 'javascript'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="size-2 rounded-full bg-red-400/50" />
                                                        <div className="size-2 rounded-full bg-amber-400/50" />
                                                        <div className="size-2 rounded-full bg-green-400/50" />
                                                    </div>
                                                </div>
                                                <div className="relative group/code">
                                                    <textarea
                                                        value={submissionCode}
                                                        onChange={(e) => setSubmissionCode(e.target.value)}
                                                        placeholder="// Paste or write your code here..."
                                                        className="w-full h-96 p-8 rounded-[24px] bg-[#0E1117] text-slate-300 border border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all font-mono text-sm leading-relaxed resize-none shadow-2xl custom-scrollbar"
                                                    />
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                        <span className="text-[10px] text-slate-600 font-mono uppercase">Read-write Mode</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTask.deliverable_type === 'mcq' && (
                                            <div className="space-y-12">
                                                {(activeTask.quiz_data || activeTask.submission_config?.questions || []).map((q: any, qIdx: number) => (
                                                    <div key={qIdx} className="space-y-6">
                                                        <h4 className="font-bold text-slate-900 dark:text-white flex gap-3">
                                                            <span className="text-primary" style={brandColorText as any}>{qIdx + 1}.</span> {q.question}
                                                        </h4>
                                                        <div className="grid gap-3">
                                                            {(q.options || []).map((opt: string, optIdx: number) => {
                                                                const isSelected = mcqAnswers[q.id || qIdx] === opt;
                                                                const activeStyles = orgBranding.brand_color ? {
                                                                    borderColor: orgBranding.brand_color,
                                                                    backgroundColor: `${orgBranding.brand_color}0d`,
                                                                    color: orgBranding.brand_color
                                                                } : {
                                                                    borderColor: 'var(--primary)',
                                                                    backgroundColor: 'rgba(var(--primary), 0.05)',
                                                                    color: 'var(--primary)'
                                                                };

                                                                return (
                                                                    <button
                                                                        key={optIdx}
                                                                        onClick={() => setMcqAnswers(prev => ({ ...prev, [q.id || qIdx]: opt }))}
                                                                        className={cn(
                                                                            "w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-4",
                                                                            isSelected
                                                                                ? "shadow-sm"
                                                                                : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
                                                                        )}
                                                                        style={isSelected ? activeStyles as any : {}}
                                                                    >
                                                                        <div className={cn(
                                                                            "size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                                                            isSelected ? "bg-primary border-primary" : "border-slate-200 dark:border-slate-700"
                                                                        )} style={isSelected ? (brandColorBg as any) : {}}>
                                                                            {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                                                                        </div>
                                                                        {opt}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(!activeTask.deliverable_type || activeTask.deliverable_type === 'file') && (
                                            <div className="py-12 flex flex-col items-center">
                                                <p className="text-slate-400 text-sm font-medium mb-4">Click to upload or drag and drop files</p>
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500">PDF</span>
                                                    <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500">PPTX</span>
                                                    <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500">DOCX</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <button
                                            onClick={() => !isSubmitting && handleSubmit()}
                                            disabled={isSubmitting}
                                            className="px-12 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                            style={brandColorBg}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Deliverable"}
                                        </button>

                                        {statusMessage && (
                                            <div className={cn(
                                                "mt-6 px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in-95 slide-in-from-top-4",
                                                statusMessage.type === 'success'
                                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                                            )}>
                                                {statusMessage.type === 'success' ? <CheckCircle2 className="size-5" /> : <Activity className="size-5" />}
                                                {statusMessage.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Sticky Footer */}
            <footer className="h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-12 fixed bottom-0 left-0 right-0 z-50">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <Trophy className="size-5 text-amber-500" />
                        Achievements
                    </button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />
                    <Link href="/student/dashboard" className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <LayoutDashboard className="size-4" /> Back to Dashboard
                    </Link>
                </div>

                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 p-3 text-slate-400 hover:text-primary transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest mr-2">Help Center</span>
                        <FlaskConical className="size-5" />
                    </button>

                    {activeTaskIndex < simulation.tasks.length - 1 ? (
                        <button
                            onClick={() => {
                                const nextStatus = getTaskStatus(simulation.tasks[activeTaskIndex + 1].id, activeTaskIndex + 1);
                                if (nextStatus !== 'locked') {
                                    setActiveTaskIndex(prev => prev + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            disabled={getTaskStatus(simulation.tasks[activeTaskIndex + 1].id, activeTaskIndex + 1) === 'locked'}
                            className="bg-primary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            style={brandColorBg}
                        >
                            Next Task <ArrowRight className="size-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/student/dashboard')}
                            className="bg-green-600 hover:scale-105 active:scale-95 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-600/20 flex items-center gap-3"
                        >
                            Complete Simulation <Trophy className="size-5" />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
