"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BuilderSidebar from "./BuilderSidebar";
import BuilderHeader from "./BuilderHeader";
import TaskMapSidebar from "./TaskMapSidebar";
import ProgramMetadataForm from "./steps/ProgramMetadataForm";
import EmployerBrandingForm from "./steps/EmployerBrandingForm";
import LearningOutcomesForm from "./steps/LearningOutcomesForm";
import TaskFlowBuilder from "./steps/TaskFlowBuilder";
import CertificationSetup from "./steps/CertificationSetup";

interface SimulationBuilderViewProps {
    organization: {
        id: string;
        name: string;
    };
    user: User;
    initialSimulationId?: string;
}

export type BuilderStep = 'metadata' | 'tasks' | 'branding';

export default function SimulationBuilderView({ organization, user, initialSimulationId }: SimulationBuilderViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize step from URL or fallback to state
    const stepFromUrl = searchParams.get('step') as BuilderStep | null;
    const [currentStep, setCurrentStep] = useState<BuilderStep>(stepFromUrl || 'metadata');
    const [simulationId, setSimulationId] = useState<string | null>(initialSimulationId || null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [completedSteps, setCompletedSteps] = useState<BuilderStep[]>([]);
    const [saveTrigger, setSaveTrigger] = useState(0);

    // Sync state with URL when step changes
    const navigateToStep = (step: BuilderStep) => {
        setCurrentStep(step);
        const params = new URLSearchParams(searchParams);
        params.set('step', step);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Auto-update state if URL changes (e.g. back button)
    useEffect(() => {
        const urlStep = searchParams.get('step') as BuilderStep | null;
        if (urlStep && urlStep !== currentStep) {
            setCurrentStep(urlStep);
        }
    }, [searchParams, currentStep]);

    const markStepCompleted = (step: BuilderStep) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
        }
    };

    const handleSimulationCreated = (id: string) => {
        setSimulationId(id);
        // If we're on the /create page, redirect to the /edit page immediately
        if (pathname.includes('/simulations/create')) {
            router.push(`/enterprise/simulations/edit/${id}?step=metadata`);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'metadata':
                return (
                    <ProgramMetadataForm
                        simulationId={simulationId}
                        saveTrigger={saveTrigger}
                        onSimulationCreated={handleSimulationCreated}
                        onSaveSuccess={() => setLastSaved(new Date())}
                        onNext={() => {
                            markStepCompleted('metadata');
                            navigateToStep('tasks');
                        }}
                    />
                );
            case 'tasks':
                return (
                    <TaskFlowBuilder
                        simulationId={simulationId!}
                        onNext={() => {
                            markStepCompleted('tasks');
                            navigateToStep('branding');
                        }}
                        onBack={() => navigateToStep('metadata')}
                    />
                );
            case 'branding':
                return (
                    <EmployerBrandingForm
                        simulationId={simulationId!}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={() => setLastSaved(new Date())}
                        onNext={() => {
                            markStepCompleted('branding');
                            // Close builder or navigate away
                            window.location.href = '/enterprise/simulations';
                        }}
                        onBack={() => navigateToStep('tasks')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Left Sidebar - Navigation */}
            <BuilderSidebar
                currentStep={currentStep}
                onStepChange={navigateToStep}
                completedSteps={completedSteps}
                user={user}
                canNavigate={!!simulationId}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <BuilderHeader
                    currentStep={currentStep}
                    simulationId={simulationId}
                    lastSaved={lastSaved}
                    onSave={() => setSaveTrigger(prev => prev + 1)}
                />

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {renderStep()}
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Task Map (Hidden as requested) */}
            {/* {simulationId && (
                <TaskMapSidebar simulationId={simulationId} />
            )} */}
        </div>
    );
}
