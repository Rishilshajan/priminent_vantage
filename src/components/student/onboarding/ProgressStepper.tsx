import React from 'react';

interface ProgressStepperProps {
    currentStep: number;
    progressPercentage: number;
}

export default function ProgressStepper({ currentStep, progressPercentage }: ProgressStepperProps) {
    const steps = [
        "Basic Identity",
        "Background & Education",
        "Professional Experience",
        "Skills & Career Goals",
        "Presence & Visibility"
    ];

    return (
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-[#7f13ec]/5 dark:border-slate-800/60 dark:bg-[#1e1429]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Profile Completion</h3>
                    <p className="text-sm font-medium text-slate-500">{progressPercentage}% Completed</p>
                </div>
            </div>

            <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50 dark:border-slate-800/60 dark:bg-[#1a1325] md:flex-row">
                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div
                            key={step}
                            className={`flex flex-1 items-center justify-center p-4 text-center border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 last:border-0 ${isActive
                                    ? "bg-gradient-to-br from-[#7f13ec] to-[#a344ff] text-white shadow-inner"
                                    : isCompleted
                                        ? "bg-[#7f13ec]/5 text-[#7f13ec]"
                                        : ""
                                }`}
                        >
                            <span className={`text-[12px] font-bold tracking-wide ${!isActive && !isCompleted ? "text-slate-400" : ""
                                }`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
