"use client";

import { useEffect, useState } from "react";
import { updateSimulation, getSimulation, publishSimulation } from "@/actions/simulations";
import { useRouter } from "next/navigation";
import { Simulation, SimulationTask } from "@/lib/simulations";

interface ReviewPublishProps {
    simulationId: string | null;
    onBack: () => void;
    onEdit: (step: string) => void;
    canPublish: boolean;
}

export default function ReviewPublish({ simulationId, onBack, onEdit, canPublish }: ReviewPublishProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [simulation, setSimulation] = useState<Simulation | null>(null);

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

        try {
            const result = await publishSimulation(simulationId);

            if (result.error) {
                alert(result.error);
                setPublishing(false);
                return;
            }

            router.push('/enterprise/simulations');
        } catch (err) {
            console.error("Failed to publish:", err);
            alert("An unexpected error occurred while publishing.");
            setPublishing(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading review data...</div>;
    }

    if (!simulation) {
        return <div className="p-8 text-center text-red-500">Error loading simulation.</div>;
    }

    const SectionCard = ({ title, step, children }: { title: string, step: string, children: React.ReactNode }) => (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {title}
                </h3>
                <button
                    onClick={() => onEdit(step)}
                    className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const LabelValue = ({ label, value, className = "" }: { label: string, value: React.ReactNode, className?: string }) => (
        <div className={className}>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{label}</div>
            <div className="text-sm text-slate-900 dark:text-slate-100 font-medium">{value || <span className="text-slate-400 italic">Not set</span>}</div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Publish</h2>
                <p className="text-slate-500">Review all details carefully. Once published, students can immediately enroll.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* 1. Program Essentials */}
                <SectionCard title="Program Essentials" step="metadata">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <LabelValue label="Title" value={simulation.title} className="md:col-span-2" />
                        <LabelValue label="Program Type" value={simulation.program_type?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} />
                        <LabelValue label="Industry" value={simulation.industry} />
                        <LabelValue label="Target Role" value={simulation.target_role} />
                        <LabelValue label="Level" value={simulation.difficulty_level ? simulation.difficulty_level.charAt(0).toUpperCase() + simulation.difficulty_level.slice(1) : 'Not set'} />
                        <LabelValue label="Duration" value={simulation.duration} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <LabelValue label="Short Description" value={simulation.short_description} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Full Description</div>
                        <div className="text-sm text-slate-900 dark:text-slate-100 font-medium prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: simulation.description || '<span class="text-slate-400 italic">Not set</span>' }} />
                    </div>
                </SectionCard>

                {/* 2. Learning Outcomes */}
                <SectionCard title="Learning Outcomes & Skills" step="outcomes">
                    <div className="space-y-4">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Skills</div>
                            <div className="flex flex-wrap gap-2">
                                {simulation.simulation_skills && simulation.simulation_skills.length > 0 ? (
                                    simulation.simulation_skills.map(skill => (
                                        <span key={skill.id} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800">
                                            {skill.skill_name}
                                        </span>
                                    ))
                                ) : <span className="text-sm text-slate-400 italic">No skills added</span>}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Learning Outcomes</div>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                {simulation.learning_outcomes?.map((outcome, i) => (
                                    <li key={i}>{outcome}</li>
                                ))}
                                {(!simulation.learning_outcomes || simulation.learning_outcomes.length === 0) && (
                                    <li className="list-none text-slate-400 italic">No outcomes defined</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </SectionCard>

                {/* 3. Task Flow */}
                <SectionCard title="Task Flow" step="tasks">
                    <div className="space-y-3">
                        {simulation.simulation_tasks && simulation.simulation_tasks.length > 0 ? (
                            simulation.simulation_tasks.sort((a, b) => a.order_index - b.order_index).map((task, index) => (
                                <div key={task.id} className="flex items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-500 mr-3 mt-0.5">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mb-1">{task.title}</h4>
                                            <div className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${task.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {task.status}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">timer</span>
                                                {task.estimated_time || 'No time set'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">assignment</span>
                                                {task.deliverable_type?.replace('_', ' ') || 'Unknown Type'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-slate-400 italic text-center py-4">No tasks created yet</div>
                        )}
                    </div>
                </SectionCard>

                {/* 4. Assessment & Criteria */}
                <SectionCard title="Assessment" step="assessment">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <LabelValue label="Target Audience" value={simulation.target_audience} />
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Prerequisites</div>
                            <div className="text-sm text-slate-900 dark:text-slate-100 font-medium prose prose-sm max-w-none dark:prose-invert leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: simulation.prerequisites || '<span class="text-slate-400 italic">Not set</span>' }} />
                        </div>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Grading Criteria</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: simulation.grading_criteria || '<p class="italic text-slate-400">No criteria set</p>' }} />
                </SectionCard>

                {/* 5. Employer Branding */}
                <SectionCard title="Employer Branding" step="branding">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Side: Compact Logo */}
                        <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-32">
                            <div className="w-32 h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-3 flex items-center justify-center shadow-sm">
                                {simulation.company_logo_url ? (
                                    <img src={simulation.company_logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : <span className="text-xs text-slate-400">No Logo</span>}
                            </div>
                        </div>

                        {/* Right Side: Content & Banner */}
                        <div className="flex-1 space-y-6">
                            {/* Company Information - Top Right */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                    {simulation.organizations?.name || <span className="text-slate-400 italic font-normal">Company Name Not Set</span>}
                                </h3>

                                <div className="space-y-6 mb-8">
                                    {simulation.about_company && (
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">About Us</h4>
                                            <div
                                                className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: simulation.about_company }}
                                            />
                                        </div>
                                    )}

                                    {simulation.why_work_here && (
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Why work at {simulation.organizations?.name || 'our company'}?</h4>
                                            <div
                                                className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: simulation.why_work_here }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Banner - Bottom of section (1200x400) */}
                            <div className="w-full aspect-[3/1] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative bg-cover bg-center border border-slate-200 dark:border-slate-700 shadow-sm" style={{ backgroundImage: simulation.banner_url ? `url(${simulation.banner_url})` : undefined }}>
                                {!simulation.banner_url && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">
                                        No program banner uploaded
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* 6. Certification */}
                <SectionCard title="Certification" step={simulation.certificate_enabled ? "certification" : "branding"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelValue label="Status" value={
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${simulation.certificate_enabled ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600'}`}>
                                {simulation.certificate_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                        } />
                        {simulation.certificate_enabled && (
                            <>
                                <LabelValue label="Director Name" value={simulation.certificate_director_name} />
                                <LabelValue label="Director Title" value={simulation.certificate_director_title} />
                            </>
                        )}
                    </div>
                </SectionCard>

                {/* 7. Visibility */}
                <SectionCard title="Visibility & Access" step="visibility">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LabelValue label="Visibility Mode" value={
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                                {simulation.visibility?.replace('_', ' ')}
                            </span>
                        } />
                    </div>
                </SectionCard>

            </div>


            {/* Publish Validation & Action */}
            {/* Publish Validation & Action */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>

                <div className="flex items-center gap-4">
                    {!canPublish && (
                        <div className="hidden md:flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30">
                            <span className="material-symbols-outlined text-sm">error</span>
                            <span>Complete all steps to publish</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={publishing || !canPublish}
                        className={`px-8 py-3 text-sm font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2
                            ${publishing || !canPublish
                                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                                : 'bg-primary hover:bg-primary/90 shadow-primary/20 transform hover:-translate-y-0.5'
                            }`}
                    >
                        {publishing ? 'Publishing...' : 'Publish Simulation'}
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
