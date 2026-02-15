"use client";

import { useState, useEffect } from "react";
import { createSimulation, updateSimulation, getSimulation } from "@/actions/simulations";
import { INDUSTRIES, TARGET_ROLES, DURATIONS, DIFFICULTY_LEVELS, PROGRAM_TYPES, VISIBILITY_OPTIONS, AUDIENCE_LEVELS } from "@/lib/simulations";
import { SKILL_CATEGORIES, ALL_SKILLS } from "@/lib/skills-data";

interface ProgramMetadataFormProps {
    simulationId: string | null;
    saveTrigger?: number;
    onSimulationCreated: (id: string) => void;
    onSaveSuccess?: () => void;
    onNext: () => void;
}

export default function ProgramMetadataForm({ simulationId, saveTrigger, onSimulationCreated, onSaveSuccess, onNext }: ProgramMetadataFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        short_description: '',
        industry: '',
        target_role: '',
        duration: '4-6 hours',
        difficulty_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
        program_type: 'job_simulation' as any,
        learning_outcomes: [] as string[],
        prerequisites: '',
        target_audience: 'Final Year Students',
        visibility: 'draft' as 'draft' | 'internal' | 'public' | 'private',
        analytics_tags: [] as string[],
        certificate_enabled: true,
    });
    const [skills, setSkills] = useState<string[]>([]); // We'll sync this with simulation_skills if needed, or just handle locally
    const [newOutcome, setNewOutcome] = useState('');
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingOutcomeIndex, setEditingOutcomeIndex] = useState<number | null>(null);
    const [editingOutcomeValue, setEditingOutcomeValue] = useState('');
    const [skillValue, setSkillValue] = useState('');

    useEffect(() => {
        if (simulationId) {
            loadSimulation();
        }
    }, [simulationId]);

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
                duration: result.data.duration || '4-6 hours',
                difficulty_level: result.data.difficulty_level || 'intermediate',
                program_type: result.data.program_type || 'job_simulation',
                learning_outcomes: result.data.learning_outcomes || [],
                prerequisites: result.data.prerequisites || '',
                target_audience: result.data.target_audience || 'Final Year Students',
                visibility: result.data.visibility || 'draft',
                analytics_tags: result.data.analytics_tags || [],
                certificate_enabled: result.data.certificate_enabled !== false,
            });
            if (result.data.simulation_skills) {
                setSkills(result.data.simulation_skills.map((s: any) => s.skill_name));
            } else if (result.data.skills) { // Fallback check
                setSkills(result.data.skills.map((s: any) => typeof s === 'string' ? s : s.skill_name));
            }
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

        // [BUGFIX]: Collect pending input values that haven't been "entered" yet
        let finalAnalyticsTags = [...formData.analytics_tags];
        if (newTag.trim() && !finalAnalyticsTags.includes(newTag.trim())) {
            finalAnalyticsTags.push(newTag.trim());
            setFormData(prev => ({ ...prev, analytics_tags: finalAnalyticsTags }));
            setNewTag('');
        }

        let finalLearningOutcomes = [...formData.learning_outcomes];
        if (newOutcome.trim() && !finalLearningOutcomes.includes(newOutcome.trim())) {
            finalLearningOutcomes.push(newOutcome.trim());
            setFormData(prev => ({ ...prev, learning_outcomes: finalLearningOutcomes }));
            setNewOutcome('');
        }

        const dataToSave = {
            ...formData,
            analytics_tags: finalAnalyticsTags,
            learning_outcomes: finalLearningOutcomes,
        };

        if (simulationId) {
            // Update existing simulation
            const result = await updateSimulation(simulationId, dataToSave as any);
            if (result.error) {
                alert(result.error);
            } else {
                // Synchronize skills (atomic replace)
                const { syncSimulationSkills } = await import("@/actions/simulations");
                await syncSimulationSkills(simulationId, skills);
                onSaveSuccess?.();
            }
        } else {
            // Create new simulation
            const result = await createSimulation(dataToSave as any);
            if (result.error) {
                alert(result.error);
            } else if (result.data) {
                const newId = result.data.id;
                // Save skills for new simulation FIRST
                const { syncSimulationSkills } = await import("@/actions/simulations");
                await syncSimulationSkills(newId, skills);

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

            {/* Section: Learning Content */}
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
                            {formData.learning_outcomes.map((outcome: string, index: number) => (
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
                                                    const updated = [...formData.learning_outcomes];
                                                    updated[index] = editingOutcomeValue.trim();
                                                    handleChange('learning_outcomes', updated as any);
                                                }
                                                setEditingOutcomeIndex(null);
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && editingOutcomeValue.trim()) {
                                                    const updated = [...formData.learning_outcomes];
                                                    updated[index] = editingOutcomeValue.trim();
                                                    handleChange('learning_outcomes', updated as any);
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
                                            onClick={() => handleChange('learning_outcomes', formData.learning_outcomes.filter((_, i) => i !== index) as any)}
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
                                        handleChange('learning_outcomes', [...formData.learning_outcomes, newOutcome.trim()] as any);
                                        setNewOutcome('');
                                    }
                                }}
                                className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                placeholder="Add a specific outcome (e.g. Understand backend service architecture)"
                            />
                            <button
                                onClick={() => {
                                    if (newOutcome.trim()) {
                                        handleChange('learning_outcomes', [...formData.learning_outcomes, newOutcome.trim()] as any);
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

            {/* Section: Advanced Settings */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Advanced Settings & Visibility
                    </h2>
                    <p className="text-sm text-slate-500">
                        Configure access, requirements, and internal tags.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Prerequisites */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Prerequisites (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.prerequisites || ''}
                            onChange={(e) => handleChange('prerequisites', e.target.value)}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="e.g. Basic Python knowledge, Familiarity with Excel"
                        />
                    </div>

                    {/* Target Audience Level */}
                    <div>
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
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Program Visibility
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {VISIBILITY_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleChange('visibility', option.value)}
                                    className={`
                                        flex flex-col p-4 rounded-xl border-2 transition-all text-left
                                        ${formData.visibility === option.value
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-primary/20 bg-background-light dark:bg-slate-800/50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`material-symbols-outlined text-lg ${formData.visibility === option.value ? 'text-primary font-bold' : 'text-slate-400'}`}>
                                            {option.value === 'draft' ? 'draft' :
                                                option.value === 'internal' ? 'corporate_fare' :
                                                    option.value === 'educator_assigned' ? 'school' :
                                                        option.value === 'public' ? 'public' :
                                                            option.value === 'private' ? 'lock' : 'archive'}
                                        </span>
                                        <span className={`text-sm font-bold ${formData.visibility === option.value ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {option.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Tags */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Internal Analytics Tags (e.g. Campus Hiring)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.analytics_tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                                    {tag}
                                    <button onClick={() => handleChange('analytics_tags', formData.analytics_tags.filter(t => t !== tag) as any)}>
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newTag.trim()) {
                                        handleChange('analytics_tags', [...formData.analytics_tags, newTag.trim()] as any);
                                        setNewTag('');
                                    }
                                }}
                                className="flex-1 bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                                placeholder="Add internal tag..."
                            />
                        </div>
                    </div>

                    {/* Certificate Enabled */}
                    <div className="col-span-2 flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
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
                            </p>
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
