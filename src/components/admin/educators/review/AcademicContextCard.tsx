"use client"

import { useState } from "react"
import { BookOpen, PencilLine, Save, X, Plus } from "lucide-react"
import { updateEducatorApplication } from "@/actions/educator-application.actions"

interface AcademicContextCardProps {
    application: any;
}

export function AcademicContextCard({ application }: AcademicContextCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        courses_teaching: application.courses_teaching,
        estimated_students: application.estimated_students,
        intended_usage: application.intended_usage,
        implementation_types: application.implementation_types || []
    })

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateEducatorApplication(application.id, formData)
        setIsSaving(false)
        if (result.success) {
            setIsEditing(false)
            window.location.reload()
        } else {
            alert(result.error || "Failed to update information")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddType = (type: string) => {
        if (!type) return;
        const currentTypes = formData.implementation_types || []
        if (!currentTypes.includes(type)) {
            setFormData(prev => ({ ...prev, implementation_types: [...currentTypes, type] }))
        }
    }

    const handleRemoveType = (type: string) => {
        const currentTypes = formData.implementation_types || []
        setFormData(prev => ({ ...prev, implementation_types: currentTypes.filter((t: string) => t !== type) }))
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                    <BookOpen className="size-4 text-primary" />
                    Academic Context
                </h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                    >
                        <PencilLine className="size-4" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 uppercase tracking-wider"
                        >
                            <Save className="size-3" />
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                    <div className="space-y-1.5 col-span-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Courses Teaching</p>
                        {isEditing ? (
                            <input
                                name="courses_teaching"
                                value={formData.courses_teaching}
                                onChange={handleChange}
                                placeholder="Comma separated list"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary outline-none mt-1"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {application.courses_teaching?.split(',').map((course: string, i: number) => (
                                    <div key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {course.trim()}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Students</p>
                        {isEditing ? (
                            <input
                                name="estimated_students"
                                value={formData.estimated_students}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{application.estimated_students}</p>
                        )}
                    </div>

                    <div className="space-y-1.5 col-span-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Intended Usage & Curriculum Integration</p>
                        {isEditing ? (
                            <textarea
                                name="intended_usage"
                                value={formData.intended_usage}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-none"
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                "{application.intended_usage}"
                            </p>
                        )}

                        <div className="mt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Implementation Types</p>
                            <div className="flex flex-wrap gap-2">
                                {formData.implementation_types?.map((type: string) => (
                                    <span key={type} className="px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-800 flex items-center gap-1.5">
                                        {type}
                                        {isEditing && (
                                            <button onClick={() => handleRemoveType(type)} className="hover:text-purple-900">
                                                <X className="size-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                                {isEditing && (
                                    <div className="flex gap-1 ml-2">
                                        <input
                                            id="new-type-input"
                                            placeholder="Add..."
                                            className="w-20 bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-0.5 text-[10px] font-bold focus:ring-1 focus:ring-primary outline-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddType((e.target as HTMLInputElement).value);
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('new-type-input') as HTMLInputElement;
                                                handleAddType(input.value);
                                                input.value = '';
                                            }}
                                            className="p-1 bg-primary text-white rounded-md"
                                        >
                                            <Plus className="size-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
