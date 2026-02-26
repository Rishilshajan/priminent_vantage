"use client"

import { useState } from "react"
import { User, ExternalLink, ShieldCheck, Edit2, Save, X } from "lucide-react"
import { updateEnterpriseRequest } from "@/actions/enterprise/enterprise-request.actions"

interface AdminInfoCardProps {
    requestId: string
    fullName: string
    jobTitle: string
    email: string
    isVerifiedDomain: boolean
    phone: string
    linkedin: string
}

export function AdminInfoCard({
    requestId,
    fullName: initialFullName,
    jobTitle: initialJobTitle,
    email: initialEmail,
    isVerifiedDomain,
    phone: initialPhone,
    linkedin: initialLinkedin
}: AdminInfoCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        admin_name: initialFullName,
        admin_title: initialJobTitle,
        admin_email: initialEmail,
        admin_phone: initialPhone,
        admin_linkedin: initialLinkedin
    })

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateEnterpriseRequest(requestId, formData)
        setIsSaving(false)
        if (result.success) {
            setIsEditing(false)
            alert("Administrator information updated successfully!")
            window.location.reload()
        } else {
            alert(result.error || "Failed to update administrator information")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary size-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                        Primary Administrator
                    </h3>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Edit Administrator Information"
                    >
                        <Edit2 className="size-4" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Save className="size-3.5" />
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
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                    <User className="size-10 text-slate-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 w-full">
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                        {isEditing ? (
                            <input
                                name="admin_name"
                                value={formData.admin_name}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-sm font-bold border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                        ) : (
                            <p className="text-base font-bold text-slate-900 dark:text-white">{formData.admin_name}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</p>
                        {isEditing ? (
                            <input
                                name="admin_title"
                                value={formData.admin_title}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formData.admin_title}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Work Email</p>
                        {isEditing ? (
                            <input
                                name="admin_email"
                                value={formData.admin_email}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.admin_email}</p>
                                {isVerifiedDomain && (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] px-1.5 py-0.5 rounded font-black uppercase    border border-green-200 dark:border-green-800">
                                        Verified Domain
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</p>
                        {isEditing ? (
                            <input
                                name="admin_phone"
                                value={formData.admin_phone}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.admin_phone}</p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn Profile</p>
                        {isEditing ? (
                            <input
                                name="admin_linkedin"
                                value={formData.admin_linkedin}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-sm font-bold border rounded dark:bg-slate-800 dark:border-slate-700"
                            />
                        ) : (
                            <a
                                href={(() => {
                                    const clean = formData.admin_linkedin.replace(/(https?:\/\/)+/g, "").replace(/^www\./, "").trim();
                                    return `https://${clean.includes('linkedin.com') ? clean : `www.linkedin.com/in/${clean}`}`;
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                            >
                                {formData.admin_linkedin.replace(/(https?:\/\/)+/g, "https://")}
                                <ExternalLink className="size-3.5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
