"use client";

import { useState, useEffect } from "react";
import { getSimulation, addSkills, removeSkill } from "@/actions/simulations";
import { TECHNICAL_SKILLS, SOFT_SKILLS, getSkillSuggestions } from "@/lib/simulations";

interface LearningOutcomesFormProps {
    simulationId: string;
    onNext: () => void;
    onBack: () => void;
}

export default function LearningOutcomesForm({ simulationId, onNext, onBack }: LearningOutcomesFormProps) {
    const [skills, setSkills] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSimulation();
    }, [simulationId]);

    const loadSimulation = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            const simulationSkills = result.data.simulation_skills?.map((s: any) => s.skill_name) || [];
            setSkills(simulationSkills);

            // Generate suggestions based on industry and role
            const suggested = getSkillSuggestions(result.data.industry, result.data.target_role);
            setSuggestions(suggested.filter(s => !simulationSkills.includes(s)));
        }
        setLoading(false);
    };

    const handleAddSkill = async (skillName: string) => {
        if (!skillName.trim() || skills.includes(skillName)) return;

        const result = await addSkills(simulationId, [skillName]);
        if (!result.error) {
            setSkills(prev => [...prev, skillName]);
            setSuggestions(prev => prev.filter(s => s !== skillName));
            setInputValue('');
        }
    };

    const handleRemoveSkill = async (skillName: string) => {
        const result = await removeSkill(simulationId, skillName);
        if (!result.error) {
            setSkills(prev => prev.filter(s => s !== skillName));
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            handleAddSkill(inputValue.trim());
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><span className="text-slate-400">Loading...</span></div>;
    }

    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skill Tagging</h2>
                        <p className="text-sm text-slate-500">Identify technical and soft skills measured in this simulation.</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded tracking-widest uppercase">
                        Smart Suggestions Enabled
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Target Skills */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Target Skills
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg min-h-[48px] items-center">
                            {skills.map(skill => (
                                <span
                                    key={skill}
                                    className="bg-primary text-white text-[11px] font-bold py-1 px-3 rounded-full flex items-center gap-2"
                                >
                                    {skill}
                                    <button
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-200"
                                    >
                                        close
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 min-w-[120px]"
                                placeholder="Type to add skills..."
                            />
                        </div>
                    </div>

                    {/* Suggested Skills */}
                    {suggestions.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Suggested Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => handleAddSkill(skill)}
                                        className="text-[11px] font-bold border border-primary/20 text-slate-500 py-1 px-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all"
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Common Skills */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            Common Technical Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {TECHNICAL_SKILLS.slice(0, 10).map(skill => (
                                !skills.includes(skill) && (
                                    <button
                                        key={skill}
                                        onClick={() => handleAddSkill(skill)}
                                        className="text-[11px] font-bold border border-primary/20 text-slate-500 py-1 px-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all"
                                    >
                                        + {skill}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            Common Soft Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SOFT_SKILLS.slice(0, 8).map(skill => (
                                !skills.includes(skill) && (
                                    <button
                                        key={skill}
                                        onClick={() => handleAddSkill(skill)}
                                        className="text-[11px] font-bold border border-primary/20 text-slate-500 py-1 px-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all"
                                    >
                                        + {skill}
                                    </button>
                                )
                            ))}
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
                    Back to Branding
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    Continue to Task Builder
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
