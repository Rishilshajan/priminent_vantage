import { Play, BookOpen, Presentation, Type, Code2, ListChecks, FileText, CheckCircle2, Edit3, Eye, File as LucideFile } from "lucide-react";
import { DeliverableInput } from "./DeliverableInput";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImplementationTaskProps {
    activeTask: any;
    submission?: any;
    submissionText: string;
    setSubmissionText: (val: string) => void;
    submissionCode: string;
    setSubmissionCode: (val: string) => void;
    mcqAnswers: Record<string, string>;
    setMcqAnswers: (val: any) => void;
    selectedFile: File | null;
    setSelectedFile: (val: File | null) => void;
    isSubmitting: boolean;
    handleSubmit: () => void;
    statusMessage: { type: 'success' | 'error', text: string } | null;
    primaryBgStyle: any;
}

export function ImplementationTask({
    activeTask,
    submission,
    submissionText,
    setSubmissionText,
    submissionCode,
    setSubmissionCode,
    mcqAnswers,
    setMcqAnswers,
    selectedFile,
    setSelectedFile,
    isSubmitting,
    handleSubmit,
    statusMessage,
    primaryBgStyle
}: ImplementationTaskProps) {
    const [showPreview, setShowPreview] = useState(!!submission);
    const normalizedType = (activeTask.deliverable_type || 'file_upload').toLowerCase();

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Your Task
            </h1>

            <div className="space-y-8">
                <div className="bg-purple-500/5 dark:bg-purple-500/10 p-10 rounded-[40px] border border-purple-500/10 dark:border-purple-500/20">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed">
                        <div className="text-base text-slate-900 dark:text-slate-100 font-medium space-y-4"
                            dangerouslySetInnerHTML={{
                                __html: (activeTask.instructions || "Follow the requirements below to complete your submission.")
                                    .replace(/•/g, "<br/>•")
                                    .replace(/Step (\d+):/g, "<br/><strong className='text-slate-900'>Step $1:</strong>")
                                    .replace(/<br\/><br\/><br\/>/g, "<br/><br/>") // Cleanup
                            }}
                        />
                    </div>
                </div>

                {(activeTask.attachments || []).length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resources to help you</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeTask.attachments.map((file: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={file.file_url || file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all group shadow-sm"
                                >
                                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors">
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

                {activeTask.submission_instructions && (
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Instructions</h3>
                        <div className="bg-yellow-50 dark:bg-yellow-500/10 p-8 rounded-[32px] border border-yellow-200/50 dark:border-yellow-500/20 shadow-sm">
                            <div className="prose prose-sm prose-yellow dark:prose-invert max-w-none 
                                prose-p:text-yellow-900 dark:prose-p:text-yellow-100 prose-p:font-medium prose-p:leading-relaxed
                                prose-li:text-yellow-900 dark:prose-li:text-yellow-100 prose-li:font-medium
                                prose-ol:list-decimal prose-ul:list-disc"
                                dangerouslySetInnerHTML={{
                                    __html: activeTask.submission_instructions
                                        .replace(/Step (\d+):/g, "<strong class='text-yellow-900 dark:text-yellow-100 mt-4 block'>Step $1:</strong>")
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Deliverable</h2>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                                {(() => {
                                    if (normalizedType === 'text') return <><Type className="size-3" /> Text Submission</>;
                                    if (normalizedType === 'code_snippet') return <><Code2 className="size-3" /> Code Submission</>;
                                    if (normalizedType === 'mcq' || normalizedType === 'multiple_choice') return <><ListChecks className="size-3" /> Multiple Choice</>;
                                    return <><FileText className="size-3" /> File Upload</>;
                                })()}
                            </div>
                            {submission && (
                                <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3" /> Completed
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {submission && (
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:border-black dark:hover:border-white transition-all shadow-sm"
                            >
                                {showPreview ? <><Edit3 className="size-4" /> Edit Submission</> : <><Eye className="size-4" /> View Submission</>}
                            </button>
                        )}
                        {activeTask.pdf_brief_url && (
                            <a
                                href={activeTask.pdf_brief_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                            >
                                <Presentation className="size-4" /> Download Brief
                            </a>
                        )}
                    </div>
                </div>

                {showPreview && submission ? (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-200 dark:border-white/10 overflow-hidden">
                            <div className="bg-white dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Your Submission</h3>
                                <span className="text-[10px] font-bold text-slate-400">
                                    Submitted {new Date(submission.created_at || submission.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="p-10">
                                {normalizedType === 'text' && (
                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed text-slate-700 dark:text-slate-300">
                                        {(submission.submission_data?.content || submission.submission_data?.text || "No content found.").split('\n').map((para: string, i: number) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                )}
                                {normalizedType === 'mcq' && (
                                    <div className="space-y-6">
                                        {activeTask.mcq_config?.questions?.map((q: any, qIdx: number) => {
                                            const answer = submission.submission_data?.answers?.[qIdx] || submission.submission_data?.answers?.[q.id];
                                            return (
                                                <div key={qIdx} className="space-y-3">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</p>
                                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                                                        <CheckCircle2 className="size-4 text-green-500" />
                                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">{answer || "No answer recorded"}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                {normalizedType === 'code_snippet' && (
                                    <div className="relative group">
                                        <pre className="p-6 rounded-2xl bg-slate-900 text-slate-300 font-mono text-sm overflow-x-auto border border-white/5">
                                            <code>{submission.submission_data?.content || submission.submission_data?.code || "// No code content found."}</code>
                                        </pre>
                                    </div>
                                )}
                                {normalizedType === 'file_upload' && (
                                    <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[32px] flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                                {submission.submission_data?.file_name?.toLowerCase().endsWith('.pdf') ? <FileText className="size-8 text-red-500" /> : <LucideFile className="size-8 text-slate-400" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {submission.submission_data?.file_name || "Submitted Project File"}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                                    Status: Successfully Submitted
                                                </p>
                                            </div>
                                        </div>
                                        {submission.submission_data?.file_url && (
                                            <a
                                                href={submission.submission_data.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="size-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500 hover:text-white transition-all shadow-sm group-hover:scale-105 active:scale-95"
                                            >
                                                <Eye className="size-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <DeliverableInput
                        activeTask={activeTask}
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
            </div>
        </div>
    );
}
