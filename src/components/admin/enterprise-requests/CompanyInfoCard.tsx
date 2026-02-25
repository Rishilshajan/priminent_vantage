"use client"

import { useState } from "react"
import { Building2, ExternalLink, Edit2, Save, X } from "lucide-react"
import { updateEnterpriseRequest } from "@/actions/enterprise/enterprise-request.actions"

interface CompanyInfoCardProps {
    requestId: string
    legalName: string
    country: string
    website: string
    industry: string
    companySize: string
    taxId: string
    hqLocation: string
    hiringRegions: string[]
}

export function CompanyInfoCard({
    requestId,
    legalName: initialLegalName,
    country: initialCountry,
    website: initialWebsite,
    industry: initialIndustry,
    companySize: initialCompanySize,
    taxId: initialTaxId,
    hqLocation: initialHqLocation,
    hiringRegions: initialHiringRegions
}: CompanyInfoCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        company_name: initialLegalName,
        country: initialCountry,
        website: initialWebsite,
        industry: initialIndustry,
        company_size: initialCompanySize,
        registration_number: initialTaxId,
        hq_location: initialHqLocation,
        hiring_regions: initialHiringRegions[0] || ""
    })

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateEnterpriseRequest(requestId, formData)
        setIsSaving(false)
        if (result.success) {
            setIsEditing(false)
            alert("Company information updated successfully!")
            window.location.reload() // Simple reload to refresh the view
        } else {
            alert(result.error || "Failed to update company information")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                    <Building2 className="text-primary size-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                        Company Information
                    </h3>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Edit Company Information"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Legal Entity Name</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.company_name}</p>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country of Registration</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.country}</p>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Website</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <a
                            href={`https://${formData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            {formData.website}
                            <ExternalLink className="size-3.5" />
                        </a>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.industry}</p>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Size</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="company_size"
                            value={formData.company_size}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.company_size}</p>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">CRN / Tax ID</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.registration_number}</p>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters Location</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="hq_location"
                            value={formData.hq_location}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.hq_location || "Not specified"}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hiring Regions</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="hiring_regions"
                            value={formData.hiring_regions}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm font-semibold border rounded dark:bg-slate-800 dark:border-slate-700"
                            placeholder="e.g. USA, India, UK"
                        />
                    ) : (
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {formData.hiring_regions || "None specified"}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
