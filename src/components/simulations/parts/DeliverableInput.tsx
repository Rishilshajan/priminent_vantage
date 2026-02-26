import { Type, Code2, ListChecks, FileText, CheckCircle2, Upload, X, File, FileArchive, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/enterprise/simulations/builder/RichTextEditor";
import { useRef } from "react";

interface DeliverableInputProps {
    activeTask: any;
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

export function DeliverableInput({
    activeTask,
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
}: DeliverableInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const normalizedType = (activeTask.deliverable_type || 'file_upload').toLowerCase();
    const isText = normalizedType === 'text';
    const isCode = normalizedType === 'code_snippet';
    const isMcq = normalizedType === 'mcq' || normalizedType === 'multiple_choice';
    const isFile = !isText && !isCode && !isMcq;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="size-8 text-red-500" />;
        if (['zip', 'rar', '7z'].includes(ext || '')) return <FileArchive className="size-8 text-orange-500" />;
        if (['png', 'jpg', 'jpeg', 'svg'].includes(ext || '')) return <ImageIcon className="size-8 text-blue-500" />;
        return <File className="size-8 text-slate-400" />;
    };

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-6 lg:p-10 transition-all",
            isSubmitting && "opacity-50 cursor-wait"
        )}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    {isText && (
                        <div className="text-left">
                            <RichTextEditor
                                value={submissionText}
                                onChange={setSubmissionText}
                                placeholder="State your findings, analyze the data, and provide your structured response here..."
                                minHeight="400px"
                            />
                        </div>
                    )}

                    {(isCode || normalizedType === 'code') && (
                        <div className="text-left space-y-0 shadow-2xl rounded-[32px] overflow-hidden border border-slate-800">
                            <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {activeTask.code_config?.language || 'JavaScript'}
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="size-2 rounded-full bg-red-500/20" />
                                    <div className="size-2 rounded-full bg-yellow-500/20" />
                                    <div className="size-2 rounded-full bg-green-500/20" />
                                </div>
                            </div>
                            <textarea
                                value={submissionCode}
                                onChange={(e) => setSubmissionCode(e.target.value)}
                                className="w-full h-80 p-8 bg-slate-950 text-slate-300 font-mono text-sm leading-relaxed outline-none resize-y"
                                placeholder="// Write your code here..."
                                spellCheck={false}
                            />
                        </div>
                    )}

                    {isMcq && (
                        <div className="text-left space-y-6">
                            {(activeTask.quiz_data || []).map((q: any, qIdx: number) => (
                                <div key={qIdx} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                                        <span className="text-purple-500 mr-2">{qIdx + 1}.</span> {q.question}
                                    </p>
                                    <div className="space-y-3 pl-6">
                                        {(q.options || []).map((opt: string, oIdx: number) => {
                                            const isSelected = mcqAnswers[qIdx] === oIdx.toString();
                                            return (
                                                <label key={oIdx} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={cn(
                                                        "flex items-center justify-center size-5 rounded-full border transition-all shrink-0",
                                                        isSelected
                                                            ? "border-purple-500 bg-purple-500 text-white"
                                                            : "border-slate-300 dark:border-slate-600 group-hover:border-purple-500 text-transparent"
                                                    )}>
                                                        <CheckCircle2 className="size-3" />
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIdx}`}
                                                        value={oIdx}
                                                        checked={isSelected}
                                                        onChange={() => setMcqAnswers((prev: any) => ({ ...prev, [qIdx]: oIdx.toString() }))}
                                                        className="hidden"
                                                    />
                                                    <span className={cn(
                                                        "text-sm font-medium transition-colors",
                                                        isSelected ? "text-slate-900 dark:text-white font-bold" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                                    )}>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isFile && (
                        <div className="space-y-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.pptx,.zip"
                            />

                            {!selectedFile ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="py-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] flex flex-col items-center gap-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group/upload"
                                >
                                    <div className="size-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/upload:scale-110 group-hover/upload:text-purple-500 transition-all">
                                        <Upload className="size-8" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-slate-900 dark:text-white font-bold">Upload your work findings</p>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest leading-relaxed">Accepted formats: PDF, PPTX, DOCX, ZIP<br />Max file size: 50MB</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                            {getFileIcon(selectedFile.name)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm group-hover:scale-105 active:scale-95"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={() => !isSubmitting && handleSubmit()}
                        disabled={isSubmitting}
                        className="px-16 py-5 rounded-full text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        style={primaryBgStyle}
                    >
                        {isSubmitting ? "SUBMITTING..." : "CONFIRM SUBMISSION"}
                    </button>

                    {statusMessage && (
                        <div className={cn(
                            "mt-6 px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-3",
                            statusMessage.type === 'success' ? "text-green-500" : "text-red-500"
                        )}>
                            {statusMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
