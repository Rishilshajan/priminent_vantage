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

export type BuilderStep = 'metadata' | 'tasks' | 'branding';

export default function SimulationBuilderView({ organization, user, initialSimulationId }: SimulationBuilderViewProps) {
    const [currentStep, setCurrentStep] = useState<BuilderStep>('metadata');
    const [simulationId, setSimulationId] = useState<string | null>(initialSimulationId || null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [completedSteps, setCompletedSteps] = useState<BuilderStep[]>([]);
    const [saveTrigger, setSaveTrigger] = useState(0);

    const markStepCompleted = (step: BuilderStep) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'metadata':
                return (
                    <ProgramMetadataForm
                        simulationId={simulationId}
                        saveTrigger={saveTrigger}
                        onSimulationCreated={(id) => {
                            setSimulationId(id);
                        }}
                        onNext={() => {
                            markStepCompleted('metadata');
                            setCurrentStep('tasks');
                        }}
                    />
                );
            case 'tasks':
                return (
                    <TaskFlowBuilder
                        simulationId={simulationId!}
                        onNext={() => {
                            markStepCompleted('tasks');
                            setCurrentStep('branding');
                        }}
                        onBack={() => setCurrentStep('metadata')}
                    />
                );
            case 'branding':
                return (
                    <EmployerBrandingForm
                        simulationId={simulationId!}
                        onNext={() => {
                            markStepCompleted('branding');
                            // Close builder or navigate away
                            window.location.href = '/enterprise/simulations';
                        }}
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
                    onSave={() => setLastSaved(new Date())}
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
