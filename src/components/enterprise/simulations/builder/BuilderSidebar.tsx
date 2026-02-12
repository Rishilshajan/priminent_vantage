"use client";

import { User } from "@supabase/supabase-js";
import { BuilderStep } from "./SimulationBuilderView";

interface BuilderSidebarProps {
    currentStep: BuilderStep;
    onStepChange: (step: BuilderStep) => void;
    user: User;
    canNavigate: boolean;
}

const steps = [
    { id: 'metadata' as BuilderStep, label: 'Program Metadata', icon: 'settings' },
    { id: 'branding' as BuilderStep, label: 'Employer Branding', icon: 'branding_watermark' },
    { id: 'outcomes' as BuilderStep, label: 'Learning Outcomes', icon: 'psychology' },
    { id: 'tasks' as BuilderStep, label: 'Task Flow Builder', icon: 'account_tree' },
    { id: 'certification' as BuilderStep, label: 'Certification Setup', icon: 'verified' },
];

export default function BuilderSidebar({ currentStep, onStepChange, user, canNavigate }: BuilderSidebarProps) {
    return (
        <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-slate-900 flex flex-col">
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

            {/* Navigation Steps */}
            <nav className="flex-1 p-4 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Builder Steps
                </div>
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isClickable = canNavigate || step.id === 'metadata';

                    return (
                        <button
                            key={step.id}
                            onClick={() => isClickable && onStepChange(step.id)}
                            disabled={!isClickable}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : isClickable
                                        ? 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                }
                            `}
                        >
                            <span className="material-symbols-outlined">{step.icon}</span>
                            <span>{step.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-primary/5">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {user.email}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
                            Enterprise Admin
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
