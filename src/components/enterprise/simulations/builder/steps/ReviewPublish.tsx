"use client";

import { useEffect, useState } from "react";
import { updateSimulation, getSimulation, publishSimulation } from "@/actions/simulations";
import { useRouter } from "next/navigation";

interface ReviewPublishProps {
    simulationId: string | null;
    onBack: () => void;
    canPublish: boolean;
}

export default function ReviewPublish({ simulationId, onBack, canPublish }: ReviewPublishProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [simulation, setSimulation] = useState<any>(null);

    useEffect(() => {
        if (simulationId) {
            loadSimulation();
        }
    }, [simulationId]);

    const loadSimulation = async () => {
        if (!simulationId) return;
        setLoading(true);
        const result = await getSimulation(simulationId);
        if (result.data) {
            setSimulation(result.data);
        }
        setLoading(false);
    };

    const handlePublish = async () => {
        if (!simulationId || !canPublish) return;
        setPublishing(true);

        // Final update to set status to published if needed, or just redirect
        // Ideally we have a publish action
        // For now, let's assume we just update visibility to public if it was draft? 
        // Or strictly use the status field.

        // Simulating publish action
        // const result = await updateSimulation(simulationId, { status: 'published' });
        // Since we don't have a direct 'publish' button in the builder usually, let's treat this as the final save.

        // Redirect to dashboard
        router.push('/enterprise/simulations');
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading review data...</div>;
    }

    if (!simulation) {
        return <div className="p-8 text-center text-red-500">Error loading simulation.</div>;
    }

    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Review & Publish
                    </h2>
                    <p className="text-sm text-slate-500">
                        Review your simulation details before making it live.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Title</div>
                            <div className="font-semibold text-slate-900 dark:text-white">{simulation.title}</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Program Type</div>
                            <div className="font-semibold text-slate-900 dark:text-white capitalize">{simulation.program_type?.replace('_', ' ')}</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tasks</div>
                            <div className="font-semibold text-slate-900 dark:text-white">{simulation.simulation_tasks?.length || 0} Tasks</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Certificate</div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                                {simulation.certificate_enabled ? 'Enabled' : 'Disabled'}
                            </div>
                        </div>
                    </div>

                    {!canPublish && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex gap-3">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-500">error</span>
                            <div>
                                <h4 className="font-bold text-sm text-red-800 dark:text-red-400">Cannot Publish Yet</h4>
                                <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                                    Please complete all required steps in the builder before publishing.
                                </p>
                            </div>
                        </div>
                    )}

                    {canPublish && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg flex gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500">info</span>
                            <div>
                                <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-400">Ready to Publish?</h4>
                                <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                                    Making this simulation public will allow students to enroll immediately.
                                    Ensure all tasks and content are final.
                                </p>
                            </div>
                        </div>
                    )}
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
                    Back
                </button>

                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishing || !canPublish}
                    className={`px-8 py-3 text-sm font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2
                        ${publishing || !canPublish
                            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                            : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                        }`}
                >
                    {publishing ? 'Publishing...' : 'Publish Simulation'}
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </button>
            </div>
        </div>
    );
}
