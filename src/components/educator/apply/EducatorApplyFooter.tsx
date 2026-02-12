"use client";

import { HelpCircle, HeadphonesIcon, Sparkles, Timer } from "lucide-react";

export function EducatorApplyFooter() {
    return (
        <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12 text-center max-w-4xl mx-auto">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 px-4">
                Need Assistance?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm group">
                    <HelpCircle className="size-8 text-primary mb-3 mx-auto" />
                    <h4 className="font-semibold mb-1 dark:text-white">FAQs</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Common questions about educator access.
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm group">
                    <HeadphonesIcon className="size-8 text-primary mb-3 mx-auto" />
                    <h4 className="font-semibold mb-1 dark:text-white">Direct Support</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Contact our academic partnerships team.
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm group">
                    <Sparkles className="size-8 text-primary mb-3 mx-auto" />
                    <h4 className="font-semibold mb-1 dark:text-white">Feature Guide</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        See what you get as a verified educator.
                    </p>
                </div>
            </div>

            <div className="mt-12 mb-10 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    <Timer className="size-3.5" />
                    <span>Typical verification turnaround: 48 hours</span>
                </div>
                <div className="max-w-xs mx-auto text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                    © 2026 Prominent Vantage. All rights reserved. Secured by Enterprise Encryption.
                </div>
            </div>
        </div>
    );
}
