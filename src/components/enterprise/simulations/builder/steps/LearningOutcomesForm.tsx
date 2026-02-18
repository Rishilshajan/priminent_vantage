"use client";

import { useState, useEffect } from "react";
import { createSimulation, updateSimulation, getSimulation, getOrganizationSkills, syncSimulationSkills } from "@/actions/simulations";
import { Simulation } from "@/lib/simulations";

interface LearningOutcomesFormProps {
    simulationId: string | null;
    initialData?: Simulation | null;
    saveTrigger?: number;
    onSimulationCreated?: (id: string) => void;
    onSaveSuccess?: () => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function LearningOutcomesForm({ simulationId, initialData, saveTrigger, onSaveSuccess, onNext, onBack }: LearningOutcomesFormProps) {
    const [learningOutcomes, setLearningOutcomes] = useState<string[]>(initialData?.learning_outcomes || []);

    // Skills state
    const [skills, setSkills] = useState<string[]>([]);
    const [availableSkills, setAvailableSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');

    const [newOutcome, setNewOutcome] = useState('');

    // Only loading if we have id but no data
    const [loading, setLoading] = useState(!!simulationId && !initialData);
    const [saving, setSaving] = useState(false);
    const [editingOutcomeIndex, setEditingOutcomeIndex] = useState<number | null>(null);
    const [editingOutcomeValue, setEditingOutcomeValue] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        // Fetch available skills from organization
        const fetchSkills = async () => {
            const result = await getOrganizationSkills();
            if (result.data) {
                setAvailableSkills(result.data);
            }
        };
        fetchSkills();

        if (simulationId && !initialData) {
            loadSimulation();
        } else if (initialData) {
            // Update state if initialData changes (e.g. parent re-fetch)
            setLearningOutcomes(initialData.learning_outcomes || []);

            // Extract skills from initialData
            if (initialData.simulation_skills) {
                setSkills(initialData.simulation_skills.map((s: any) => s.skill_name));
            } else if ((initialData as any).skills) {
                setSkills((initialData as any).skills.map((s: any) => typeof s === 'string' ? s : s.skill_name));
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
            setLearningOutcomes(result.data.learning_outcomes || []);

            if (result.data.simulation_skills) {
                setSkills(result.data.simulation_skills.map((s: any) => s.skill_name));
            }
        }
        setLoading(false);
    };

    const validateForm = () => {
        const newErrors: string[] = [];
        if (skills.length === 0) {
            newErrors.push("At least one skill tag is required.");
        }
        if (learningOutcomes.length === 0) {
            newErrors.push("At least one learning outcome is required.");
        }
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSave = async (shouldAdvance = false) => {
        if (!simulationId) return; // Should already exist by this step

        if (shouldAdvance && !validateForm()) {
            return;
        }

        setSaving(true);
        setErrors([]);

        // Collect pending input values
        let finalLearningOutcomes = [...learningOutcomes];
        if (newOutcome.trim() && !finalLearningOutcomes.includes(newOutcome.trim())) {
            finalLearningOutcomes.push(newOutcome.trim());
            setNewOutcome('');
        }

        // 1. Save outcomes
        const dataToSave = {
            learning_outcomes: finalLearningOutcomes,
        };

        const result = await updateSimulation(simulationId, dataToSave as any);
        if (result.error) {
            alert(result.error);
        } else {
            // 2. Sync skills
            const syncResult = await syncSimulationSkills(simulationId, skills);
            if (syncResult.error) {
                console.error("Skill sync failed:", syncResult.error);
            }

            onSaveSuccess?.();

            if (shouldAdvance) {
                onNext();
            }
        }

        setSaving(false);
    };

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter' && (e as React.KeyboardEvent).key !== ',') return;
        if (e.type === 'keydown') e.preventDefault();

        const skill = skillInput.trim();
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
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
                        Learning & Skills
                    </h2>
                    <p className="text-sm text-slate-500">
                        Define the measurable skills and outcomes students will achieve.
                    </p>
                </div>

                {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Validation Errors</h4>
                                <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Skill Tags - Company Specific */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Skill Tags
                        </label>
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    list="skill-tags"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    onBlur={handleAddSkill}
                                    className={`w-full bg-background-light dark:bg-slate-800 border rounded-lg focus:ring-primary focus:border-primary text-sm p-3 ${skills.length === 0 && errors.length > 0 ? 'border-red-300 ring-1 ring-red-300/50' : 'border-primary/10'}`}
                                    placeholder="Type specific skills (e.g. Python, Agile, SQL)... Press Enter to add"
                                />
                                <datalist id="skill-tags">
                                    {availableSkills.map(skill => (
                                        <option key={skill} value={skill} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Selected Skills */}
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Tag the relevant skills students will practice. These help in candidate analytics and matching.
                        </p>
                    </div>

                    {/* Learning Outcomes */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Structured Learning Outcomes
                        </label>
                        <div className="space-y-2 mb-3">
                            {learningOutcomes.map((outcome: string, index: number) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 group">
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                    {editingOutcomeIndex === index ? (
                                        <input
                                            type="text"
                                            autoFocus
                                            value={editingOutcomeValue}
                                            onChange={(e) => setEditingOutcomeValue(e.target.value)}
                                            onBlur={() => {
                                                if (editingOutcomeValue.trim()) {
                                                    const updated = [...learningOutcomes];
                                                    updated[index] = editingOutcomeValue.trim();
                                                    setLearningOutcomes(updated);
                                                }
                                                setEditingOutcomeIndex(null);
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && editingOutcomeValue.trim()) {
                                                    const updated = [...learningOutcomes];
                                                    updated[index] = editingOutcomeValue.trim();
                                                    setLearningOutcomes(updated);
                                                    setEditingOutcomeIndex(null);
                                                }
                                            }}
                                            className="flex-1 bg-white dark:bg-slate-900 border border-primary/20 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    ) : (
                                        <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">{outcome}</span>
                                    )}

                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        {editingOutcomeIndex !== index && (
                                            <button
                                                onClick={() => {
                                                    setEditingOutcomeIndex(index);
                                                    setEditingOutcomeValue(outcome);
                                                }}
                                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-slate-400 hover:text-primary text-sm">edit</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index))}
                                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-slate-400 hover:text-red-500 text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newOutcome}
                                onChange={(e) => setNewOutcome(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newOutcome.trim()) {
                                        setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
                                        setNewOutcome('');
                                    }
                                }}
                                className={`flex-1 bg-background-light dark:bg-slate-800 border rounded-lg focus:ring-primary focus:border-primary text-sm p-3 ${learningOutcomes.length === 0 && errors.length > 0 ? 'border-red-300 ring-1 ring-red-300/50' : 'border-primary/10'}`}
                                placeholder="Add a specific outcome (e.g. Understand backend service architecture)"
                            />
                            <button
                                onClick={() => {
                                    if (newOutcome.trim()) {
                                        setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
                                        setNewOutcome('');
                                    }
                                }}
                                className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Add
                            </button>
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
                    Back
                </button>

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        Continue to Task Flow
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
