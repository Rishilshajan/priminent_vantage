"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    ArrowRight,
    Undo2,
    Trophy,
    Zap
} from "lucide-react";
import { StudentHeader } from "@/components/student/StudentHeader";
import { submitTaskAction, uploadTaskFileAction, completeSimulationAction } from "@/actions/student/simulation_hub.actions";
import { cn } from "@/lib/utils";

// Parts
import { Sidebar } from "./parts/Sidebar";
import { TaskOverview } from "./parts/TaskOverview";
import { BackgroundInfo } from "./parts/BackgroundInfo";
import { ImplementationTask } from "./parts/ImplementationTask";
import { Resources } from "./parts/Resources";
import { CompletionView } from "./parts/CompletionView";

interface SimulationHubViewProps {
    simulation: any;
    userData: any;
    orgBranding: {
        brand_color: string | null;
        logo_url: string | null;
    };
    submissions: any[];
}

export function SimulationHubView({ simulation, userData, orgBranding, submissions }: SimulationHubViewProps) {
    const router = useRouter();
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);
    const [subStep, setSubStep] = useState(0); // 0: Overview, 1: Background, 2: Resources, 3: Implementation

    // Derived state
    const activeTask = simulation.tasks[activeTaskIndex] || (simulation.tasks.length > 0 ? simulation.tasks[0] : null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [certificateData, setCertificateData] = useState<any>(null);

    // Submission States
    const [submissionText, setSubmissionText] = useState("");
    const [submissionCode, setSubmissionCode] = useState("");
    const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Primary Branding Color
    const PRIMARY_COLOR = "#4e2a84";
    const primaryBgStyle = { backgroundColor: PRIMARY_COLOR };

    // Reset states when task changes
    useEffect(() => {
        const type = (activeTask?.deliverable_type || '').toLowerCase();
        if ((type === 'code' || type === 'code_snippet') && activeTask?.code_config?.starter_code) {
            setSubmissionCode(activeTask.code_config.starter_code);
        } else {
            setSubmissionCode("");
        }

        setSubmissionText("");
        setMcqAnswers({});
        setSelectedFile(null);
        setStatusMessage(null);
    }, [activeTaskIndex, activeTask]);

    // Reset sub-step when switching tasks
    useEffect(() => {
        setSubStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTaskIndex]);

    const handleSubmit = async () => {
        if (!activeTask) return;

        setIsSubmitting(true);
        setStatusMessage(null);

        let finalSubmissionData: any = {
            submitted_at: new Date().toISOString(),
            type: activeTask.deliverable_type || 'file_upload'
        };

        const type = (activeTask.deliverable_type || 'file_upload').toLowerCase();

        if (type === 'text') {
            if (submissionText.trim().length < 50) {
                setStatusMessage({ type: 'error', text: "Please provide a more detailed response (min 50 characters)." });
                setIsSubmitting(false);
                return;
            }
            finalSubmissionData.content = submissionText;
        } else if (type === 'mcq' || type === 'multiple_choice') {
            finalSubmissionData.answers = mcqAnswers;
        } else if (type === 'code_snippet' || type === 'code') {
            finalSubmissionData.content = submissionCode;
        } else if (type === 'file_upload') {
            if (!selectedFile) {
                setStatusMessage({ type: 'error', text: "Please select a file to upload." });
                setIsSubmitting(false);
                return;
            }

            // 1. Upload File
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('simulationId', simulation.id);
            formData.append('taskId', activeTask.id);

            const uploadResult = await uploadTaskFileAction(formData);
            if (!uploadResult.success) {
                setStatusMessage({ type: 'error', text: uploadResult.error || "File upload failed." });
                setIsSubmitting(false);
                return;
            }
            finalSubmissionData.file_url = uploadResult.url;
            finalSubmissionData.file_name = selectedFile.name;
        }

        try {
            const result = await submitTaskAction(simulation.id, activeTask.id, finalSubmissionData);
            if (result.success) {
                setStatusMessage({ type: 'success', text: "Task completed successfully!" });
                router.refresh(); // Refresh to update submissions and sidebar status

                setTimeout(() => {
                    if (activeTaskIndex < simulation.tasks.length - 1) {
                        setActiveTaskIndex(prev => prev + 1);
                    }
                }, 2000);
            } else {
                setStatusMessage({ type: 'error', text: result.error || "Failed to submit task." });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteSimulation = async () => {
        setIsSubmitting(true);
        setStatusMessage(null);
        try {
            const result = await completeSimulationAction(simulation.id);
            if (result.success) {
                setCertificateData(result.certificate);
                setIsCompleted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setStatusMessage({ type: 'error', text: result.error || "Failed to complete simulation." });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (subStep < 3) {
            setSubStep(prev => prev + 1);
            setStatusMessage(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Already on last sub-step, logic handled by Submit or Next Task button
        }
    };

    const handleBack = () => {
        if (subStep > 0) {
            setSubStep(prev => prev - 1);
            setStatusMessage(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (activeTaskIndex > 0) {
            setActiveTaskIndex(prev => prev - 1);
        }
    };

    const getTaskStatus = (taskId: string, index: number) => {
        const submission = submissions.find(s => s.task_id === taskId);
        if (submission) return 'completed';
        if (index === 0) return 'available';
        const prevTask = simulation.tasks[index - 1];
        const prevSubmission = submissions.find(s => s.task_id === prevTask.id);
        return prevSubmission ? 'available' : 'locked';
    };

    // Calculate overall progress
    const totalTasks = simulation.tasks.length;
    const completedTasks = submissions.length;
    const overallProgress = Math.round((completedTasks / totalTasks) * 100);

    if (isCompleted) {
        return (
            <CompletionView
                simulation={simulation}
                userData={userData}
                orgBranding={orgBranding}
                certificateData={certificateData}
            />
        );
    }

    if (!activeTask) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
                <LayoutDashboard className="size-16 text-slate-300 mb-6" />
                <h1 className="text-xl font-bold">No tasks found for this simulation.</h1>
                <Link href="/student/dashboard" className="text-primary hover:underline mt-4">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans">
            <StudentHeader userData={userData} orgBranding={orgBranding} />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    simulation={simulation}
                    activeTaskIndex={activeTaskIndex}
                    setActiveTaskIndex={setActiveTaskIndex}
                    submissions={submissions}
                    primaryBgStyle={primaryBgStyle}
                    getTaskStatus={getTaskStatus}
                />

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 custom-scrollbar">
                    <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 px-12 border-b border-slate-100 dark:border-slate-800 transition-all">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                {simulation.tasks.map((_: any, idx: number) => {
                                    const status = getTaskStatus(_.id, idx);
                                    const isCompleted = status === 'completed';
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "size-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter transition-all border",
                                                idx === activeTaskIndex
                                                    ? "text-white border-transparent"
                                                    : isCompleted
                                                        ? "bg-green-500 border-transparent text-white"
                                                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-slate-400"
                                            )}
                                            style={idx === activeTaskIndex ? primaryBgStyle : {}}
                                        >
                                            {idx + 1}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Phase {activeTaskIndex + 1} • Step {subStep + 1} of 4
                            </div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto py-12 px-8 pb-40">
                        {subStep === 0 && (
                            <TaskOverview
                                activeTask={activeTask}
                                simulation={simulation}
                                activeTaskIndex={activeTaskIndex}
                                subStep={subStep}
                            />
                        )}

                        {subStep === 1 && (
                            <BackgroundInfo activeTask={activeTask} />
                        )}

                        {subStep === 2 && (
                            <Resources activeTask={activeTask} />
                        )}

                        {subStep === 3 && (
                            <ImplementationTask
                                activeTask={activeTask}
                                submission={submissions.find(s => s.task_id === activeTask.id)}
                                submissionText={submissionText}
                                setSubmissionText={setSubmissionText}
                                submissionCode={submissionCode}
                                setSubmissionCode={setSubmissionCode}
                                mcqAnswers={mcqAnswers}
                                setMcqAnswers={setMcqAnswers}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                isSubmitting={isSubmitting}
                                handleSubmit={handleSubmit}
                                statusMessage={statusMessage}
                                primaryBgStyle={primaryBgStyle}
                            />
                        )}

                        <div className="flex justify-between items-center pt-24">
                            <button
                                onClick={handleBack}
                                disabled={activeTaskIndex === 0 && subStep === 0}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-all disabled:opacity-20"
                            >
                                <Undo2 className="size-4" /> Back
                            </button>

                            <div className="flex gap-4">
                                {subStep < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg"
                                        style={primaryBgStyle}
                                    >
                                        Next <ArrowRight className="size-4" />
                                    </button>
                                ) : (
                                    activeTaskIndex < simulation.tasks.length - 1 ? (
                                        <button
                                            onClick={() => {
                                                const nextStatus = getTaskStatus(simulation.tasks[activeTaskIndex + 1].id, activeTaskIndex + 1);
                                                if (nextStatus !== 'locked') {
                                                    setActiveTaskIndex(prev => prev + 1);
                                                }
                                            }}
                                            disabled={getTaskStatus(simulation.tasks[activeTaskIndex + 1].id, activeTaskIndex + 1) === 'locked'}
                                            className="text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-20"
                                            style={getTaskStatus(simulation.tasks[activeTaskIndex + 1].id, activeTaskIndex + 1) !== 'locked' ? primaryBgStyle : {}}
                                        >
                                            Next Task <ArrowRight className="size-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCompleteSimulation}
                                            disabled={isSubmitting}
                                            className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-green-600/20 disabled:opacity-50"
                                        >
                                            {isSubmitting ? "COMPLETING..." : <><span className="hidden sm:inline">COMPLETE SIMULATION</span><span className="sm:hidden">COMPLETE</span> <Trophy className="size-4" /></>}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
