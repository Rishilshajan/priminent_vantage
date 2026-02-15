"use client";

import { useState, useEffect } from "react";
import { createSimulation, updateSimulation, getSimulation, syncSimulationSkills } from "@/actions/simulations";
import { ALL_SKILLS } from "@/lib/skills-data";
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

    // transform initial skills
    const getInitialSkills = () => {
        if (!initialData) return [];
        if (initialData.simulation_skills) {
            return initialData.simulation_skills.map((s: any) => s.skill_name);
        }
        return [];
    };

    const [skills, setSkills] = useState<string[]>(getInitialSkills());
    const [newOutcome, setNewOutcome] = useState('');
    const [skillValue, setSkillValue] = useState('');

    // Only loading if we have id but no data
    const [loading, setLoading] = useState(!!simulationId && !initialData);
    const [saving, setSaving] = useState(false);
    const [editingOutcomeIndex, setEditingOutcomeIndex] = useState<number | null>(null);
    const [editingOutcomeValue, setEditingOutcomeValue] = useState('');

    useEffect(() => {
        if (simulationId && !initialData) {
            loadSimulation();
        } else if (initialData) {
            // Update state if initialData changes (e.g. parent re-fetch)
            setLearningOutcomes(initialData.learning_outcomes || []);
            if (initialData.simulation_skills) {
                setSkills(initialData.simulation_skills.map((s: any) => s.skill_name));
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
            } else if (result.data.skills) { // Fallback check
                setSkills(result.data.skills.map((s: any) => typeof s === 'string' ? s : s.skill_name));
            }
        }
        setLoading(false);
    };

    const handleSave = async (shouldAdvance = false) => {
        if (!simulationId) return; // Should already exist by this step

        setSaving(true);

        // Collect pending input values
        let finalLearningOutcomes = [...learningOutcomes];
        if (newOutcome.trim() && !finalLearningOutcomes.includes(newOutcome.trim())) {
            finalLearningOutcomes.push(newOutcome.trim());
            setNewOutcome('');
        }

        const dataToSave = {
            learning_outcomes: finalLearningOutcomes,
        };

        const result = await updateSimulation(simulationId, dataToSave as any);
        if (result.error) {
            alert(result.error);
        } else {
            // Synchronize skills (don't block progress on sync error, but log it)
            const syncResult = await syncSimulationSkills(simulationId, skills);
            if (syncResult.error) {
                console.error("Skill sync failed:", syncResult.error);
                // Optional: alert user but still proceed? 
                // alert("Skills saved with warnings: " + syncResult.error);
            }

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
                        Learning & Skills
                    </h2>
                    <p className="text-sm text-slate-500">
                        Define the measurable skills and outcomes students will achieve.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Skills Multi-select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Skill Tags (Multi-select)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {skills.map(skill => (
                                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                    {skill}
                                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-primary/70">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                list="skills-list"
                                value={skillValue}
                                onChange={(e) => setSkillValue(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && skillValue.trim() && !skills.includes(skillValue.trim())) {
                                        setSkills([...skills, skillValue.trim()]);
                                        setSkillValue('');
                                    }
                                }}
                                className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                placeholder="Type to search or add a skill..."
                            />
                            <datalist id="skills-list">
                                {ALL_SKILLS.map(skill => (
                                    <option key={skill} value={skill} />
                                ))}
                            </datalist>
                            <button
                                onClick={() => {
                                    if (skillValue.trim() && !skills.includes(skillValue.trim())) {
                                        setSkills([...skills, skillValue.trim()]);
                                        setSkillValue('');
                                    }
                                }}
                                className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
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

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
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
