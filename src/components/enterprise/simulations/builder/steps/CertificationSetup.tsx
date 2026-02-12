"use client";

import { useRouter } from "next/navigation";

interface CertificationSetupProps {
    simulationId: string;
    onBack: () => void;
}

export default function CertificationSetup({ simulationId, onBack }: CertificationSetupProps) {
    const router = useRouter();

    const handleFinish = () => {
        router.push('/enterprise/simulations');
    };

    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certification Setup</h2>
                    <p className="text-sm text-slate-500">Configure completion certificates for your simulation.</p>
                </div>

                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-5xl text-primary">verified</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Certificate Generation Ready
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Certificates will be automatically generated when students complete your simulation.
                        Each certificate includes the simulation title, completion date, and skills acquired.
                    </p>

                    <div className="bg-background-light dark:bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                            Certificate Features
                        </h4>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-sm text-slate-600 dark:text-slate-300">Unique certificate ID</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-sm text-slate-600 dark:text-slate-300">Skills acquired list</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-sm text-slate-600 dark:text-slate-300">Verification URL</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-sm text-slate-600 dark:text-slate-300">LinkedIn sharing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Tasks
                </button>

                <button
                    type="button"
                    onClick={handleFinish}
                    className="px-8 py-3 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Finish & Return to Simulations
                </button>
            </div>
        </div>
    );
}
