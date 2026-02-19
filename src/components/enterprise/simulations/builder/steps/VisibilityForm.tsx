"use client";

import { useState, useEffect, useRef } from "react";
import { updateSimulation, getSimulation } from "@/actions/simulations";
import { VISIBILITY_OPTIONS } from "@/lib/simulations";

interface VisibilityFormProps {
    simulationId: string | null;
    saveTrigger?: number;
    onSaveSuccess?: () => void;
    onNext: () => void;
    onBack: () => void;
}

export default function VisibilityForm({ simulationId, saveTrigger, onSaveSuccess, onNext, onBack }: VisibilityFormProps) {
    const [formData, setFormData] = useState({
        visibility: 'draft' as 'draft' | 'internal' | 'educator_assigned' | 'public' | 'private' | 'archived',
        analytics_tags: [] as string[],
    });
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (simulationId) {
            loadSimulation();
        }
    }, [simulationId]);

    const lastSaveTrigger = useRef(saveTrigger || 0);

    useEffect(() => {
        if (saveTrigger && saveTrigger > lastSaveTrigger.current) {
            handleSave();
            lastSaveTrigger.current = saveTrigger;
        }
    }, [saveTrigger]);

    const loadSimulation = async () => {
        if (!simulationId) return;

        setLoading(true);
        const result = await getSimulation(simulationId);
        if (result.data) {
            setFormData({
                visibility: result.data.visibility || 'draft',
                analytics_tags: result.data.analytics_tags || [],
            });
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (shouldAdvance = false) => {
        if (!simulationId || loading) return;

        setSaving(true);

        let finalAnalyticsTags = [...formData.analytics_tags];
        if (newTag.trim() && !finalAnalyticsTags.includes(newTag.trim())) {
            finalAnalyticsTags.push(newTag.trim());
            setNewTag('');
        }

        const dataToSave = {
            ...formData,
            analytics_tags: finalAnalyticsTags,
        };

        const result = await updateSimulation(simulationId, dataToSave as any);
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
                        Visibility & Access
                    </h2>
                    <p className="text-sm text-slate-500">
                        Configure program visibility and internal tagging.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Program Visibility */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Program Visibility
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {VISIBILITY_OPTIONS
                                .filter(option => !['internal', 'archived'].includes(option.value))
                                .map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={async () => {
                                            if (loading || saving) return;

                                            // Optimistic update
                                            handleChange('visibility', option.value);

                                            // Auto-save
                                            if (simulationId) {
                                                setSaving(true);
                                                const dataToSave = {
                                                    visibility: option.value,
                                                    analytics_tags: formData.analytics_tags,
                                                };

                                                const result = await updateSimulation(simulationId, dataToSave as any);
                                                if (result.error) {
                                                    alert(result.error);
                                                } else {
                                                    onSaveSuccess?.();
                                                }
                                                setSaving(false);
                                            }
                                        }}
                                        disabled={saving}
                                        className={`
                                        flex flex-col p-4 rounded-xl border-2 transition-all text-left relative
                                        ${formData.visibility === option.value
                                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-primary/20 bg-background-light dark:bg-slate-800/50'
                                            }
                                        ${saving ? 'opacity-70 cursor-wait' : ''}
                                    `}
                                    >
                                        {saving && formData.visibility === option.value && (
                                            <div className="absolute top-2 right-2">
                                                <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
                                            </div>
                                        )}
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
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Internal Analytics Tags (e.g. Campus Hiring)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.analytics_tags.filter(tag => tag !== '__analytics_viewed__').map(tag => (
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

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        Continue to Analytics
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
