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
}

const stepTitles: Record<BuilderStep, string> = {
    metadata: 'Program Metadata',
    branding: 'Employer Branding',
    outcomes: 'Learning Outcomes',
    tasks: 'Task Flow Builder',
    certification: 'Certification Setup',
};

export default function BuilderHeader({ currentStep, simulationId, lastSaved, onSave }: BuilderHeaderProps) {
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

        const now = new Date();
        const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

        if (diff < 60) return 'Saved just now';
        if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
        return `Saved ${Math.floor(diff / 3600)}h ago`;
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-primary/5 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    {stepTitles[currentStep]}
                </h1>
                <span className="px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
                    {simulationId ? 'In Progress' : 'New'}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 italic">
                    {getLastSavedText()}
                </span>

                {simulationId && (
                    <>
                        <button
                            onClick={onSave}
                            className="px-4 py-2 text-sm font-semibold border border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors"
                        >
                            Save Draft
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish Simulation'}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
