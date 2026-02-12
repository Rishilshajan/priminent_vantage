"use client";

import { useState, useEffect } from "react";
import { createSimulation, updateSimulation, getSimulation } from "@/actions/simulations";
import { INDUSTRIES, TARGET_ROLES, DURATIONS, DIFFICULTY_LEVELS } from "@/lib/simulations";

interface ProgramMetadataFormProps {
    simulationId: string | null;
    onSimulationCreated: (id: string) => void;
    onNext: () => void;
}

export default function ProgramMetadataForm({ simulationId, onSimulationCreated, onNext }: ProgramMetadataFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        short_description: '',
        industry: '',
        target_role: '',
        duration: '4-6 hours',
        difficulty_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
            setFormData({
                title: result.data.title || '',
                description: result.data.description || '',
                short_description: result.data.short_description || '',
                industry: result.data.industry || '',
                target_role: result.data.target_role || '',
                duration: result.data.duration || '4-6 hours',
                difficulty_level: result.data.difficulty_level || 'intermediate',
            });
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('Please enter a program title');
            return;
        }

        setSaving(true);

        if (simulationId) {
            // Update existing simulation
            const result = await updateSimulation(simulationId, formData);
            if (result.error) {
                alert(result.error);
            }
        } else {
            // Create new simulation
            const result = await createSimulation(formData);
            if (result.error) {
                alert(result.error);
            } else if (result.data) {
                onSimulationCreated(result.data.id);
            }
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
                        Define the core identity of your virtual job simulation.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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

                    {/* Estimated Duration */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Estimated Duration
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {DURATIONS.slice(0, 3).map(duration => (
                                <button
                                    key={duration}
                                    type="button"
                                    onClick={() => handleChange('duration', duration)}
                                    className={`
                                        py-2 text-xs font-semibold rounded-lg transition-colors
                                        ${formData.duration === duration
                                            ? 'bg-primary text-white'
                                            : 'bg-background-light dark:bg-slate-800 text-slate-500 hover:bg-primary/10'
                                        }
                                    `}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {DURATIONS.slice(3).map(duration => (
                                <button
                                    key={duration}
                                    type="button"
                                    onClick={() => handleChange('duration', duration)}
                                    className={`
                                        py-2 text-xs font-semibold rounded-lg transition-colors
                                        ${formData.duration === duration
                                            ? 'bg-primary text-white'
                                            : 'bg-background-light dark:bg-slate-800 text-slate-500 hover:bg-primary/10'
                                        }
                                    `}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Difficulty Level
                        </label>
                        <div className="flex items-center gap-2">
                            {DIFFICULTY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => handleChange('difficulty_level', level.value)}
                                    className={`
                                        flex-1 py-2 text-xs font-semibold rounded-lg transition-colors
                                        ${formData.difficulty_level === level.value
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-background-light dark:bg-slate-800 text-slate-500 hover:bg-primary/10'
                                        }
                                    `}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold border border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Progress'}
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.title.trim() || saving}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Continue to Branding
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
