"use client"

import { Building2, ExternalLink } from "lucide-react"

interface CompanyInfoCardProps {
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
    legalName,
    country,
    website,
    industry,
    companySize,
    taxId,
    hqLocation,
    hiringRegions
}: CompanyInfoCardProps) {
    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <Building2 className="text-primary size-5" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Company Information
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Legal Entity Name</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{legalName}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country of Registration</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{country}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Website</p>
                    <a
                        href={`https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        {website}
                        <ExternalLink className="size-3.5" />
                    </a>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{industry}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company Size</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{companySize}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">CRN / Tax ID</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{taxId}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters Location</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{hqLocation}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hiring Regions</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {hiringRegions.join(", ")}
                    </p>
                </div>
            </div>
        </section>
    )
}
