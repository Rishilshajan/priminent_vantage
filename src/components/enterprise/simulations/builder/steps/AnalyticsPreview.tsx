"use client";

interface AnalyticsPreviewProps {
    onNext: () => void;
    onBack: () => void;
}

export default function AnalyticsPreview({ onNext, onBack }: AnalyticsPreviewProps) {
    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Analytics Preview
                    </h2>
                    <p className="text-sm text-slate-500">
                        Preview how you will track student performance and engagement.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Analytics Dashboard Preview
                    </h3>
                    <p className="text-slate-500 max-w-md mb-6">
                        Once published, you will be able to track enrollments, completion rates, and skill acquisition data here.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl opacity-60">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Enrollments</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Completion Rate</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">0%</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Avg. Score</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">-</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    Continue to Review
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
