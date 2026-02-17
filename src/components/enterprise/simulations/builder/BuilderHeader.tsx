"use client";

import { useState } from "react";
import { BuilderStep } from "./SimulationBuilderView";
import { publishSimulation } from "@/actions/simulations";
import { useRouter } from "next/navigation";

interface BuilderHeaderProps {
    currentStep: BuilderStep;
    simulationId: string | null;
    lastSaved: Date | null;
    onSave: () => void;
    isSaving?: boolean;
    onOpenSidebar?: () => void; // New prop
}

const stepTitles: Record<BuilderStep, string> = {
    metadata: 'Program Metadata',
    branding: 'Employer Branding',
    outcomes: 'Learning Outcomes',
    tasks: 'Task Flow Builder',
    assessment: 'Assessment & Submission',
    certification: 'Certification Setup',
    visibility: 'Visibility & Access',
    analytics: 'Analytics Preview',
    review: 'Review & Publish',
};

export default function BuilderHeader({ currentStep, simulationId, lastSaved, onSave, isSaving, onOpenSidebar }: BuilderHeaderProps) {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        if (!simulationId) return;

        setIsPublishing(true);
        const result = await publishSimulation(simulationId);
        setIsPublishing(false);

        if (result.error) {
            alert(result.error);
        } else {
            alert('Simulation published successfully!');
            router.push('/enterprise/simulations');
        }
    };

    const getLastSavedText = () => {
        if (!lastSaved) return 'Not saved yet';

        return `Draft Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-primary/5 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
            <div className="flex items-center gap-3">
                {/* Mobile Sidebar Trigger */}
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs md:max-w-none">
                        {stepTitles[currentStep]}
                    </h1>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
                        {simulationId ? 'In Progress' : 'New'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <span className="hidden md:inline text-xs text-slate-400 italic">
                    {getLastSavedText()}
                </span>

                {simulationId && (
                    <>
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold border border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isSaving ? 'Saving...' : <span className="hidden sm:inline">Save Draft</span>}
                            {!isSaving && <span className="sm:hidden">Save</span>}
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isPublishing ? 'Publishing...' : <span className="hidden sm:inline">Publish Simulation</span>}
                            {!isPublishing && <span className="sm:hidden">Publish</span>}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
