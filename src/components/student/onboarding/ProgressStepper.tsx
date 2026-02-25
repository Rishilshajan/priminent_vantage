import React from 'react';

export default function ProgressStepper() {
    return (
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-[#7f13ec]/5 dark:border-slate-800/60 dark:bg-[#1e1429]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Profile Completion</h3>
                    <p className="text-sm font-medium text-slate-500">20% Completed</p>
                </div>
            </div>

            <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50 dark:border-slate-800/60 dark:bg-[#1a1325] md:flex-row">
                <div className="flex flex-1 items-center justify-center border-b border-r-0 border-slate-200/60 bg-gradient-to-br from-[#7f13ec] to-[#a344ff] p-4 text-center text-white shadow-inner dark:border-slate-800/60 md:border-b-0 md:border-r">
                    <span className="text-[12px] font-bold tracking-wide">Basic Identity</span>
                </div>
                <div className="flex flex-1 items-center justify-center border-b border-r-0 border-slate-200/60 p-4 text-center dark:border-slate-800/60 md:border-b-0 md:border-r">
                    <span className="text-[12px] font-bold tracking-wide text-slate-400">Background & Education</span>
                </div>
                <div className="flex flex-1 items-center justify-center border-b border-r-0 border-slate-200/60 p-4 text-center dark:border-slate-800/60 md:border-b-0 md:border-r">
                    <span className="text-[12px] font-bold tracking-wide text-slate-400">Professional Experience</span>
                </div>
                <div className="flex flex-1 items-center justify-center border-b border-r-0 border-slate-200/60 p-4 text-center dark:border-slate-800/60 md:border-b-0 md:border-r">
                    <span className="text-[12px] font-bold tracking-wide text-slate-400">Skills & Career Goals</span>
                </div>
                <div className="flex flex-1 items-center justify-center p-4 text-center">
                    <span className="text-[12px] font-bold tracking-wide text-slate-400">Presence & Visibility</span>
                </div>
            </div>
        </div>
    );
}
