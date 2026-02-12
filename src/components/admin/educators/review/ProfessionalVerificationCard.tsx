"use client"

import { useState } from "react"
import { ExternalLink, ShieldCheck, PencilLine, Save, X, FileText } from "lucide-react"
import { updateEducatorApplication } from "@/actions/educator-application.actions"

interface ProfessionalVerificationCardProps {
    application: any;
}

export function ProfessionalVerificationCard({ application }: ProfessionalVerificationCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        linkedin_profile: application.linkedin_profile,
        verification_document_url: application.verification_document_url
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                    <ShieldCheck className="size-4 text-primary" />
                    Professional Verification
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LinkedIn Profile</p>
                        {isEditing ? (
                            <input
                                name="linkedin_profile"
                                value={formData.linkedin_profile || ''}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none mt-1"
                            />
                        ) : application.linkedin_profile ? (
                            <a
                                href={application.linkedin_profile}
                                target="_blank"
                                className="text-sm font-bold text-primary hover:underline flex items-center gap-2 mt-1"
                            >
                                View Professional Profile
                                <ExternalLink className="size-3" />
                            </a>
                        ) : (
                            <p className="text-sm font-medium text-slate-400 italic mt-1">No LinkedIn profile provided.</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proof of Affiliation</p>
                        {isEditing ? (
                            <input
                                name="verification_document_url"
                                value={formData.verification_document_url || ''}
                                onChange={handleChange}
                                placeholder="URL to PDF document"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none mt-1"
                            />
                        ) : application.verification_document_url ? (
                            <a
                                href={application.verification_document_url}
                                target="_blank"
                                className="inline-flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group/doc w-full md:w-auto"
                            >
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover/doc:text-primary transition-colors">
                                    <FileText className="size-5" />
                                </div>
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                                        {application.verification_document_url.split('/').pop()?.substring(0, 20)}...
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">PDF Document</p>
                                </div>
                                <ExternalLink className="size-4 text-slate-300 group-hover/doc:text-primary ml-auto" />
                            </a>
                        ) : (
                            <p className="text-sm font-bold text-red-500 italic mt-1">No verification document uploaded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
