interface BackgroundInfoProps {
    activeTask: any;
}

export function BackgroundInfo({ activeTask }: BackgroundInfoProps) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Background Information
            </h1>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[40px] p-10 lg:p-12 shadow-sm">
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
                    prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed
                    prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:font-medium
                    prose-ol:list-decimal prose-ul:list-disc"
                    dangerouslySetInnerHTML={{ __html: activeTask.scenario_context || "No additional context provided for this task." }}
                />
            </div>
        </div>
    );
}
