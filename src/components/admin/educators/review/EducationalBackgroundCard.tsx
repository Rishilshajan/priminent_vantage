"use client"

import { useState } from "react"
import { Building2, Globe, BadgeCheck, PencilLine, User, Save, X } from "lucide-react"
import { updateEducatorApplication } from "@/actions/educator-application.actions"
import { getDomainMatch, cn } from "@/lib/utils"

interface EducationalBackgroundCardProps {
    application: any;
}

export function EducationalBackgroundCard({ application }: EducationalBackgroundCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        institution_name: application.institution_name,
        department: application.department,
        institution_website: application.institution_website,
        designation: application.designation,
        academic_level: application.academic_level,
        institutional_email: application.institutional_email,
        full_name: application.full_name
    })

    const isDomainVerified = getDomainMatch(application.institutional_email, application.institution_website)

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
                    <Building2 className="size-4 text-primary" />
                    Educational Background
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1.5 lg:col-span-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution Name</p>
                        {isEditing ? (
                            <input
                                name="institution_name"
                                value={formData.institution_name}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{application.institution_name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p>
                        {isEditing ? (
                            <input
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{application.department}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Website</p>
                        {isEditing ? (
                            <input
                                name="institution_website"
                                value={formData.institution_website}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    href={application.institution_website?.startsWith('http') ? application.institution_website : `https://${application.institution_website}`}
                                    target="_blank"
                                    className="text-sm font-bold text-primary hover:underline flex items-center gap-1 break-all"
                                >
                                    {application.institution_website?.replace(/^https?:\/\//, '')}
                                    <Globe className="size-3 shrink-0" />
                                </a>
                                {isDomainVerified && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-[9px] font-bold uppercase   er border border-green-100 dark:border-green-800/50 shrink-0">
                                        <BadgeCheck className="size-2.5" />
                                        Domain Verified
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</p>
                        {isEditing ? (
                            <input
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{application.designation}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Level</p>
                        {isEditing ? (
                            <input
                                name="academic_level"
                                value={formData.academic_level}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{application.academic_level}</p>
                        )}
                    </div>

                    <div className="space-y-1.5 md:col-span-1 lg:col-span-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Email</p>
                        <div className="flex flex-wrap items-center gap-2">
                            {isEditing ? (
                                <input
                                    name="institutional_email"
                                    value={formData.institutional_email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                />
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white break-all">{application.institutional_email}</p>
                                    <div className="flex items-center gap-1.5">
                                        <BadgeCheck className={cn("size-4 shrink-0", isDomainVerified ? "text-green-500" : "text-green-500/30")} />
                                        {isDomainVerified && (
                                            <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase   er whitespace-nowrap bg-green-50 dark:bg-green-900/10 px-1.5 py-0.5 rounded border border-green-100 dark:border-green-800/30">Matches Domain</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                            <User className="size-4 text-primary" />
                            Primary Administrator
                        </h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 dark:border-slate-800">
                            <User className="size-7" />
                        </div>
                        <div className="flex flex-wrap gap-x-12 gap-y-4 flex-1">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                                {isEditing ? (
                                    <input
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{application.full_name}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title</p>
                                {isEditing ? (
                                    <input
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-sm font-medium opacity-50 cursor-not-allowed"
                                        title="Linked to Designation above"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{application.designation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
