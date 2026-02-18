"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { BuilderStep } from "./SimulationBuilderView";
import { Button } from "@/components/ui/button"; // Add Button import

interface BuilderSidebarProps {
    currentStep: BuilderStep;
    onStepChange: (step: BuilderStep) => void;
    completedSteps: BuilderStep[];
    user: User;
    canNavigate: boolean;
    certificateEnabled?: boolean;
    className?: string;       // New prop for styling override
    onClose?: () => void;     // New prop for closing mobile drawer
    userProfile?: any;        // Add userProfile prop
    orgName?: string;         // Add orgName prop
}

const steps = [
    { id: 'metadata' as BuilderStep, label: 'Program Metadata', icon: 'settings' },
    { id: 'outcomes' as BuilderStep, label: 'Learning Outcomes', icon: 'school' },
    { id: 'tasks' as BuilderStep, label: 'Task Flow Builder', icon: 'account_tree' },
    { id: 'assessment' as BuilderStep, label: 'Assessment & Submission', icon: 'quiz' },
    { id: 'branding' as BuilderStep, label: 'Employer Branding', icon: 'branding_watermark' },
    { id: 'certification' as BuilderStep, label: 'Certificate Management', icon: 'verified' },
    { id: 'visibility' as BuilderStep, label: 'Visibility & Access', icon: 'visibility' },
    { id: 'analytics' as BuilderStep, label: 'Analytics (Preview)', icon: 'analytics' },
    { id: 'review' as BuilderStep, label: 'Review & Publish', icon: 'publish' },
];

export default function BuilderSidebar({ currentStep, onStepChange, completedSteps, user, canNavigate, certificateEnabled = false, className, onClose, userProfile, orgName }: BuilderSidebarProps) {
    return (
        <aside className={`w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-slate-900 flex flex-col ${className}`}>
            {/* Logo */}
            <div className="p-6 border-b border-primary/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">auto_graph</span>
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white uppercase">
                        Priminent Vantage
                    </span>
                </div>
            </div>

            {/* Navigation Steps - Scrollable */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                <Link
                    href="/enterprise/simulations"
                    className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-[0.15em] border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group sticky top-0 bg-white dark:bg-slate-900 z-10"
                >
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to Dashboard
                </Link>

                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Builder Steps
                </div>
                {steps.map((step) => {
                    // Conditional Rendering for Certification
                    if (step.id === 'certification' && !certificateEnabled) return null;

                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);

                    // Sequential Locking Logic
                    let isLocked = true;
                    const stepOrder: BuilderStep[] = ['metadata', 'outcomes', 'tasks', 'assessment', 'branding', 'certification', 'visibility', 'analytics', 'review'];
                    const stepIndex = stepOrder.indexOf(step.id);

                    if (stepIndex === 0) {
                        isLocked = false;
                    } else {
                        // Check if previous step is completed
                        // Special handling for certification skipping:
                        // If previous step is branding, and we are at certification...
                        // But wait, if certification is disabled, we don't render it (handled above).

                        // General rule: Is the IMMEDIATE previous step completed?
                        // If we skip certification (branding -> visibility), we need to check if branding is done when checking visibility lock.

                        let prevStepId = stepOrder[stepIndex - 1];

                        // Adjust previous step for Visibility if Certification is skipped
                        if (step.id === 'visibility' && !certificateEnabled) {
                            prevStepId = 'branding';
                        }

                        // If the previous step is completed, we unlock this one.
                        // OR if we are just navigating back (handled by isClickable check later? No, isClickable checks lock)

                        isLocked = !completedSteps.includes(prevStepId);
                    }

                    // Allow navigation if unlocked OR already completed (to revisit)
                    // Also respect global canNavigate (e.g. if simulationId exists)
                    const isClickable = (canNavigate && !isLocked) || isCompleted;

                    return (
                        <button
                            key={step.id}
                            onClick={() => {
                                if (isClickable) {
                                    onStepChange(step.id);
                                    onClose?.(); // Close mobile sidebar on selection
                                }
                            }}
                            disabled={!isClickable}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : isClickable
                                        ? 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-60'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                                    {step.icon}
                                </span>
                                <span className="truncate">{step.label}</span>
                            </div>
                            {isCompleted && !isActive && (
                                <span className="material-symbols-outlined text-green-500 text-[18px] animate-in fade-in zoom-in duration-300">
                                    check_circle
                                </span>
                            )}
                            {isLocked && !isCompleted && (
                                <span className="material-symbols-outlined text-slate-300 text-[16px]">
                                    lock
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile & Sign Out - Fixed Bottom */}
            <div className="flex-shrink-0 p-4 border-t border-primary/5 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-900 shadow-sm">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {user?.email || "User"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
                            Enterprise Admin • {userProfile?.role || 'Admin'}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={async () => {
                        const { createClient } = await import("@/lib/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/";
                    }}
                    className="w-full h-9 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-100 dark:bg-slate-800 dark:hover:bg-red-900/10 dark:text-slate-400 dark:hover:text-red-400 dark:border-slate-700 dark:hover:border-red-900/20 rounded-lg shadow-sm transition-all"
                >
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
