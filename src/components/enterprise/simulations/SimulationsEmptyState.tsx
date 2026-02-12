"use client"

import Link from "next/link";

export default function SimulationsEmptyState() {
    return (
        <div className="flex-1 min-h-[500px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 py-12">
            <div className="max-w-md w-full text-center">

                {/* Heading and description */}
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    No simulations found
                </h2>
                <p className="text-slate-500 leading-relaxed mb-10 text-balance">
                    Get started by creating your first professional job simulation to engage your candidates and assess organizational skill acquisition.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/enterprise/simulations/create"
                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">
                            add_circle
                        </span>
                        Create Your First Simulation
                    </Link>
                </div>

                {/* Feature badges */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-center gap-12 opacity-60 grayscale">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                Enterprise Ready
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">analytics</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                Data Driven
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">security</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                Secure Cloud
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
