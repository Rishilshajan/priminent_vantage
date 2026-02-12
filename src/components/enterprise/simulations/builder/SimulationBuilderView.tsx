"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
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

export type BuilderStep = 'metadata' | 'branding' | 'outcomes' | 'tasks' | 'certification';

export default function SimulationBuilderView({ organization, user, initialSimulationId }: SimulationBuilderViewProps) {
    const [currentStep, setCurrentStep] = useState<BuilderStep>('metadata');
    const [simulationId, setSimulationId] = useState<string | null>(initialSimulationId || null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const renderStep = () => {
        switch (currentStep) {
            case 'metadata':
                return (
                    <ProgramMetadataForm
                        simulationId={simulationId}
                        onSimulationCreated={setSimulationId}
                        onNext={() => setCurrentStep('branding')}
                    />
                );
            case 'branding':
                return (
                    <EmployerBrandingForm
                        simulationId={simulationId!}
                        onNext={() => setCurrentStep('outcomes')}
                        onBack={() => setCurrentStep('metadata')}
                    />
                );
            case 'outcomes':
                return (
                    <LearningOutcomesForm
                        simulationId={simulationId!}
                        onNext={() => setCurrentStep('tasks')}
                        onBack={() => setCurrentStep('branding')}
                    />
                );
            case 'tasks':
                return (
                    <TaskFlowBuilder
                        simulationId={simulationId!}
                        onNext={() => setCurrentStep('certification')}
                        onBack={() => setCurrentStep('outcomes')}
                    />
                );
            case 'certification':
                return (
                    <CertificationSetup
                        simulationId={simulationId!}
                        onBack={() => setCurrentStep('tasks')}
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
                onStepChange={setCurrentStep}
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
                    onSave={() => setLastSaved(new Date())}
                />

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {renderStep()}
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Task Map */}
            {simulationId && (
                <TaskMapSidebar simulationId={simulationId} />
            )}
        </div>
    );
}
