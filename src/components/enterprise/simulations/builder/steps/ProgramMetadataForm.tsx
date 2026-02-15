"use client";

import { useState, useEffect } from "react";
import { createSimulation, updateSimulation, getSimulation } from "@/actions/simulations";
import { INDUSTRIES, TARGET_ROLES, PROGRAM_TYPES, Simulation } from "@/lib/simulations";
interface ProgramMetadataFormProps {
    simulationId: string | null;
    initialData?: Simulation | null;
    saveTrigger?: number;
    onSimulationCreated: (id: string) => void;
    onSaveSuccess?: () => void;
    onCertificateChange?: (enabled: boolean) => void;
    onNext: () => void;
}

export default function ProgramMetadataForm({ simulationId, initialData, saveTrigger, onSimulationCreated, onSaveSuccess, onCertificateChange, onNext }: ProgramMetadataFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        short_description: initialData?.short_description || '',
        industry: initialData?.industry || '',
        target_role: initialData?.target_role || '',
        program_type: (initialData?.program_type || 'job_simulation') as any,
    });

    // Only fetch if we have an ID but no initial data
    const [loading, setLoading] = useState(!!simulationId && !initialData);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (simulationId && !initialData) {
            loadSimulation();
        } else if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                short_description: initialData.short_description || '',
                industry: initialData.industry || '',
                target_role: initialData.target_role || '',
                program_type: initialData.program_type || 'job_simulation',
            });

            if (initialData.certificate_enabled !== undefined && initialData.certificate_enabled !== null) {
                onCertificateChange?.(initialData.certificate_enabled);
            }
            setLoading(false);
        }
    }, [simulationId, initialData]);

    useEffect(() => {
        if (saveTrigger && saveTrigger > 0) {
            handleSave();
        }
    }, [saveTrigger]);

    const loadSimulation = async () => {
        if (!simulationId) return;

        setLoading(true);
        const result = await getSimulation(simulationId);
        if (result.data) {
            setFormData({
                title: result.data.title || '',
                description: result.data.description || '',
                short_description: result.data.short_description || '',
                industry: result.data.industry || '',
                target_role: result.data.target_role || '',
                program_type: result.data.program_type || 'job_simulation',
            });
            // We still need to notify parent about certificate status even if not in this form, 
            // but ideally the parent fetches it. 
            // However, onCertificateChange is passed here. 
            // Let's keep it safe:
            if (result.data.certificate_enabled !== undefined) {
                onCertificateChange?.(result.data.certificate_enabled);
            }
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Notify parent immediately if certificate setting changes
        if (field === 'certificate_enabled') {
            onCertificateChange?.(value);
        }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a program title');
            return;
        }

        setSaving(true);

        const dataToSave = {
            ...formData,
        };

        if (simulationId) {
            // Update existing simulation
            const result = await updateSimulation(simulationId, dataToSave as any);
            if (result.error) {
                alert(result.error);
            } else {
                onSaveSuccess?.();
            }
        } else {
            // Create new simulation
            const result = await createSimulation(dataToSave as any);
            if (result.error) {
                alert(result.error);
            } else if (result.data) {
                const newId = result.data.id;
                // THEN notify parent (which triggers reload)
                onSimulationCreated(newId);
                onSaveSuccess?.();
            }
        }

        // Refresh data after save to ensure all joins/ids are synced
        if (simulationId) {
            await loadSimulation();
        }

        setSaving(false);
    };

    const handleNext = async () => {
        await handleSave();
        onNext();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="text-slate-400">Loading...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Section: General Information */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        General Information
                    </h2>
                    <p className="text-sm text-slate-500">
                        Define the core identity and classification of your program.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Program Type */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Program Type
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {PROGRAM_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleChange('program_type', type.value)}
                                    className={`
                                        flex flex-col p-4 rounded-xl border-2 transition-all text-left
                                        ${formData.program_type === type.value
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                        }
                                    `}
                                >
                                    <span className={`text-sm font-bold mb-1 ${formData.program_type === type.value ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Program Title */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Program Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="e.g. Data Analytics Strategic Sprint"
                        />
                    </div>

                    {/* Short Description */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Short Description
                        </label>
                        <input
                            type="text"
                            value={formData.short_description}
                            onChange={(e) => handleChange('short_description', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="Brief one-line summary"
                            maxLength={200}
                        />
                    </div>

                    {/* Program Description */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Program Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="Provide a detailed overview for candidates..."
                            rows={4}
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Industry
                        </label>
                        <select
                            value={formData.industry}
                            onChange={(e) => handleChange('industry', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                        >
                            <option value="">Select Industry</option>
                            {INDUSTRIES.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>

                    {/* Target Role */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Target Role
                        </label>
                        <select
                            value={formData.target_role}
                            onChange={(e) => handleChange('target_role', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                        >
                            <option value="">Select Role</option>
                            {TARGET_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.title.trim() || saving}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Continue to Learning Outcomes
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div >
    );
}
