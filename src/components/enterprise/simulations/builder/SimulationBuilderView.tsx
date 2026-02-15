"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BuilderSidebar from "./BuilderSidebar";
import BuilderHeader from "./BuilderHeader";
import TaskMapSidebar from "./TaskMapSidebar";
import ProgramMetadataForm from "./steps/ProgramMetadataForm";
import LearningOutcomesForm from "./steps/LearningOutcomesForm";
import TaskFlowBuilder from "./steps/TaskFlowBuilder";
import AssessmentForm from "./steps/AssessmentForm";
import EmployerBrandingForm from "./steps/EmployerBrandingForm";
import CertificationSetup from "./steps/CertificationSetup";
import VisibilityForm from "./steps/VisibilityForm";
import AnalyticsPreview from "./steps/AnalyticsPreview";
import ReviewPublish from "./steps/ReviewPublish";
import { getSimulation } from "@/actions/simulations";
import { Simulation } from "@/lib/simulations";

interface SimulationBuilderViewProps {
    organization: {
        id: string;
        name: string;
    };
    user: User;
    initialSimulationId?: string;
}

export type BuilderStep =
    | 'metadata'
    | 'outcomes'
    | 'tasks'
    | 'assessment'
    | 'branding'
    | 'certification'
    | 'visibility'
    | 'analytics'
    | 'review';

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
    const [certificateEnabled, setCertificateEnabled] = useState(true);
    const [saveTrigger, setSaveTrigger] = useState(0);
    const [isGlobalSaving, setIsGlobalSaving] = useState(false);
    const [simulationData, setSimulationData] = useState<Simulation | null>(null);

    // Fetch simulation data to calculate persistence
    useEffect(() => {
        if (simulationId) {
            checkProgress();
        }
    }, [simulationId, lastSaved]); // Re-check when saved

    const handleGlobalSave = () => {
        setIsGlobalSaving(true);
        setSaveTrigger(prev => prev + 1);
    };

    const handleSaveSuccess = useCallback(() => {
        setLastSaved(new Date());
        setIsGlobalSaving(false);
    }, []);

    // Verify progress with linear dependency checks to prevent false completes
    const checkProgress = async () => {
        if (!simulationId) return;
        const result = await getSimulation(simulationId);
        if (result.data) {
            const sim = result.data;
            const completed: BuilderStep[] = [];
            const certEnabled = sim.certificate_enabled !== false;
            setCertificateEnabled(certEnabled);

            // 1. Metadata Check (General Info) - No dependencies
            if (sim.title) {
                completed.push('metadata');
            }

            // 2. Outcomes Check - Depends on Metadata
            if (completed.includes('metadata') && (
                (sim.learning_outcomes && sim.learning_outcomes.length > 0) ||
                (sim.simulation_skills && sim.simulation_skills.length > 0)
            )) {
                completed.push('outcomes');
            }

            // 3. Tasks Check - Depends on Outcomes
            if (completed.includes('outcomes') && sim.simulation_tasks && sim.simulation_tasks.length > 0) {
                completed.push('tasks');
            }

            // 4. Assessment Check - Depends on Tasks
            if (completed.includes('tasks') && sim.duration && sim.difficulty_level) {
                completed.push('assessment');
            }

            // 5. Branding Check - Depends on Assessment
            if (completed.includes('assessment') && sim.company_logo_url && sim.banner_url) {
                completed.push('branding');
            }

            // 6. Certification Check
            // DEPENDS ON: Branding
            if (certEnabled) {
                if (completed.includes('branding')) {
                    completed.push('certification');
                }
            }

            // 7. Visibility Check
            // DEPENDS ON: Certification (if enabled) OR Branding (if disabled)
            let prevForVisibility: BuilderStep = 'branding';
            if (certEnabled) {
                prevForVisibility = 'certification';
            }

            if (completed.includes(prevForVisibility) && sim.visibility) {
                completed.push('visibility');
            }

            // 8. Analytics Check (Preview)
            // DEPENDS ON: Visibility
            if (completed.includes('visibility')) {
                completed.push('analytics');
            }

            // 9. Review Check Check (Not auto-completed)

            setCompletedSteps(completed);
            setSimulationData(sim);
        }
    };

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
                        initialData={simulationData}
                        saveTrigger={saveTrigger}
                        onSimulationCreated={handleSimulationCreated}
                        onSaveSuccess={handleSaveSuccess}
                        onCertificateChange={setCertificateEnabled}
                        onNext={() => {
                            markStepCompleted('metadata');
                            setTimeout(() => navigateToStep('outcomes'), 10);
                        }}
                    />
                );
            case 'outcomes':
                return (
                    <LearningOutcomesForm
                        simulationId={simulationId}
                        initialData={simulationData}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={handleSaveSuccess}
                        onNext={() => {
                            markStepCompleted('outcomes');
                            setTimeout(() => navigateToStep('tasks'), 10);
                        }}
                        onBack={() => navigateToStep('metadata')}
                    />
                );
            case 'tasks':
                return (
                    <TaskFlowBuilder
                        simulationId={simulationId!}
                        initialData={simulationData}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={handleSaveSuccess}
                        onNext={() => {
                            markStepCompleted('tasks');
                            setTimeout(() => navigateToStep('assessment'), 10);
                        }}
                        onBack={() => navigateToStep('outcomes')}
                    />
                );
            case 'assessment':
                return (
                    <AssessmentForm
                        simulationId={simulationId!}
                        initialData={simulationData}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={handleSaveSuccess}
                        onCertificateChange={setCertificateEnabled}
                        onNext={() => {
                            markStepCompleted('assessment');
                            navigateToStep('branding');
                        }}
                        onBack={() => navigateToStep('tasks')}
                    />
                );
            case 'branding':
                return (
                    <EmployerBrandingForm
                        simulationId={simulationId!}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={handleSaveSuccess}
                        certificateEnabled={certificateEnabled}
                        onNext={() => {
                            markStepCompleted('branding');
                            if (certificateEnabled) {
                                navigateToStep('certification');
                            } else {
                                navigateToStep('visibility');
                            }
                        }}
                        onBack={() => navigateToStep('assessment')}
                    />
                );
            case 'certification':
                return (
                    <CertificationSetup
                        simulationId={simulationId!}
                        organizationName={organization.name}
                        onBack={() => navigateToStep('branding')}
                        onNext={() => {
                            markStepCompleted('certification');
                            navigateToStep('visibility');
                        }}
                    />
                );
            case 'visibility':
                return (
                    <VisibilityForm
                        simulationId={simulationId!}
                        saveTrigger={saveTrigger}
                        onSaveSuccess={handleSaveSuccess}
                        onNext={() => {
                            markStepCompleted('visibility');
                            navigateToStep('analytics');
                        }}
                        onBack={() => {
                            if (certificateEnabled) {
                                navigateToStep('certification');
                            } else {
                                navigateToStep('branding');
                            }
                        }}
                    />
                );
            case 'analytics':
                return (
                    <AnalyticsPreview
                        onNext={() => {
                            markStepCompleted('analytics');
                            navigateToStep('review');
                        }}
                        onBack={() => navigateToStep('visibility')}
                    />
                );
            case 'review':
                return (
                    <ReviewPublish
                        simulationId={simulationId}
                        onBack={() => navigateToStep('analytics')}
                        canPublish={completedSteps.includes('analytics')}
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
                certificateEnabled={certificateEnabled}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <BuilderHeader
                    currentStep={currentStep}
                    simulationId={simulationId}
                    lastSaved={lastSaved}
                    onSave={handleGlobalSave}
                    isSaving={isGlobalSaving}
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
