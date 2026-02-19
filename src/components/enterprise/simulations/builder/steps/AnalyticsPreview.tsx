"use client";

import { useState } from "react";
import { updateSimulation, getSimulation } from "@/actions/simulations";

interface AnalyticsPreviewProps {
    simulationId: string | null;
    onSaveSuccess?: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AnalyticsPreview({ simulationId, onSaveSuccess, onNext, onBack }: AnalyticsPreviewProps) {
    const [isContinuing, setIsContinuing] = useState(false);

    const handleContinue = async () => {
        if (!simulationId) {
            onNext();
            return;
        }

        setIsContinuing(true);
        try {
            // Fetch current simulation to get existing tags
            const result = await getSimulation(simulationId);
            if (result.data) {
                const currentTags = result.data.analytics_tags || [];

                // Add internal tag if not present
                if (!currentTags.includes('__analytics_viewed__')) {
                    const newTags = [...currentTags, '__analytics_viewed__'];
                    await updateSimulation(simulationId, { analytics_tags: newTags } as any);

                    // Trigger parent refresh to update green ticks
                    if (onSaveSuccess) {
                        onSaveSuccess();
                    }
                }
            }
        } catch (error) {
            console.error("Error updating analytics status:", error);
            // Continue anyway to not block the user
        } finally {
            setIsContinuing(false);
            onNext();
        }
    };

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

                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-6 group">
                        <img
                            src="/images/analytics-dashboard.png"
                            alt="Enterprise Analytics Dashboard Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                        Enterprise Analytics Suite
                    </h3>
                    <p className="text-slate-500 max-w-lg mx-auto mb-2 text-sm leading-relaxed">
                        Comprehensive insights including student enrollments, completion rates, skill acquisition metrics, and engagement trends will be available in your <strong>Enterprise Dashboard</strong> once the simulation is published.
                    </p>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">
                        Available upon publication
                    </p>
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
                    onClick={handleContinue}
                    disabled={isContinuing}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isContinuing ? 'Continuing...' : 'Continue to Review'}
                    {!isContinuing && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
            </div>
        </div>
    );
}
