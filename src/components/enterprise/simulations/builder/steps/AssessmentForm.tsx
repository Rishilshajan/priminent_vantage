"use client";

import { useState, useEffect } from "react";
import { updateSimulation, getSimulation } from "@/actions/simulations";
import { DURATIONS, DIFFICULTY_LEVELS, AUDIENCE_LEVELS, Simulation } from "@/lib/simulations";
import RichTextEditor from "../RichTextEditor";

interface AssessmentFormProps {
    simulationId: string | null;
    initialData?: Simulation | null;
    saveTrigger?: number;
    onSaveSuccess?: () => void;
    onNext: () => void;
    onBack: () => void;
    onCertificateChange: (enabled: boolean) => void;
}

export default function AssessmentForm({ simulationId, initialData, saveTrigger, onSaveSuccess, onNext, onBack, onCertificateChange }: AssessmentFormProps) {
    const [formData, setFormData] = useState({
        duration: initialData?.duration || '4-6 hours',
        difficulty_level: initialData?.difficulty_level || 'intermediate',
        prerequisites: initialData?.prerequisites || '',
        target_audience: initialData?.target_audience || 'Final Year Students',
        certificate_enabled: initialData?.certificate_enabled !== false,
        grading_criteria: initialData?.grading_criteria || '',
    });

    // Only load if id exists but no data
    const [loading, setLoading] = useState(!!simulationId && !initialData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (simulationId && !initialData) {
            loadSimulation();
        } else if (initialData) {
            setFormData({
                duration: initialData.duration || '4-6 hours',
                difficulty_level: initialData.difficulty_level || 'intermediate',
                prerequisites: initialData.prerequisites || '',
                target_audience: initialData.target_audience || 'Final Year Students',
                certificate_enabled: initialData.certificate_enabled !== false,
                grading_criteria: initialData.grading_criteria || '',
            });
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
            const certEnabled = result.data.certificate_enabled !== false;
            setFormData({
                duration: result.data.duration || '4-6 hours',
                difficulty_level: result.data.difficulty_level || 'intermediate',
                prerequisites: result.data.prerequisites || '',
                target_audience: result.data.target_audience || 'Final Year Students',
                certificate_enabled: certEnabled,
                grading_criteria: result.data.grading_criteria || '',
            });
            onCertificateChange(certEnabled); // Sync parent state on load
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Notify parent immediately if certificate setting changes
        if (field === 'certificate_enabled') {
            onCertificateChange(value);
        }

        // Clear errors
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.duration) newErrors.duration = "Please select a duration";
        if (!formData.difficulty_level) newErrors.difficulty_level = "Please select a difficulty level";
        if (!formData.target_audience) newErrors.target_audience = "Please select a target audience";
        // Simple check for empty HTML or text
        if (!formData.grading_criteria || formData.grading_criteria === '<p><br></p>') {
            newErrors.grading_criteria = "Please provide grading criteria";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async (shouldAdvance = false) => {
        if (!simulationId) return;

        if (shouldAdvance && !validateForm()) {
            // Scroll to top or first error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSaving(true);
        const result = await updateSimulation(simulationId, formData as any);
        if (result.error) {
            alert(result.error);
        } else {
            onSaveSuccess?.();
            if (shouldAdvance) {
                onNext();
            }
        }
        setSaving(false);
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
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Assessment & Requirements
                    </h2>
                    <p className="text-sm text-slate-500">
                        Define difficulty, duration, and completion criteria.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Estimated Duration */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Estimated Duration
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
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
                        {errors.duration && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.duration}</p>}
                    </div>

                    {/* Difficulty Level */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Difficulty Level
                        </label>
                        {/* Difficulty Options - Always Row on Desktop, Stack on Mobile */}
                        <div className="flex flex-col sm:flex-row gap-3">
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
                        {errors.difficulty_level && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.difficulty_level}</p>}
                    </div>

                    {/* Prerequisites */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Prerequisites (Optional)
                        </label>
                        <RichTextEditor
                            value={formData.prerequisites || ""}
                            onChange={(val: string) => handleChange('prerequisites', val)}
                            placeholder="e.g. Basic Python knowledge, Familiarity with Excel..."
                            minHeight="150px"
                        />
                    </div>

                    {/* Target Audience Level */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Target Audience Level
                        </label>
                        <select
                            value={formData.target_audience || ''}
                            onChange={(e) => handleChange('target_audience', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                        >
                            {AUDIENCE_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                        {errors.target_audience && <p className="text-[10px] text-red-500 mt-1 font-bold uppercase tracking-wide">{errors.target_audience}</p>}
                    </div>

                    {/* Certificate Enabled */}
                    <div className="col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <input
                                type="checkbox"
                                id="certificate_enabled"
                                checked={formData.certificate_enabled}
                                onChange={(e) => handleChange('certificate_enabled', e.target.checked as any)}
                                className="w-5 h-5 text-primary rounded border-primary/20 focus:ring-primary"
                            />
                            <div className="flex-1">
                                <label htmlFor="certificate_enabled" className="block text-sm font-bold text-slate-900 dark:text-white">
                                    Issue certificate on completion
                                </label>
                                <p className="text-xs text-slate-500">
                                    Automatically generate a verified PDF certificate for students who finish all tasks.
                                    <strong> This will enable the Certification Management step.</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grading Criteria / Rubric */}
                    <div className="col-span-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Global Assessment Criteria & Grading Rubric
                        </label>
                        <p className="text-sm text-slate-500 mb-4">
                            Define the overall success criteria for this simulation. This will be visible to students and evaluators.
                        </p>
                        <RichTextEditor
                            value={formData.grading_criteria || ""}
                            onChange={(val: string) => handleChange('grading_criteria', val)}
                            placeholder="Enter detailed grading rubric or assessment criteria..."
                            minHeight="200px"
                        />
                        {errors.grading_criteria && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.grading_criteria}</p>}
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
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        Continue to Branding
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
