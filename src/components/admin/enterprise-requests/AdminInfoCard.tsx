"use client"

import { User, ExternalLink, ShieldCheck } from "lucide-react"

interface AdminInfoCardProps {
    fullName: string
    jobTitle: string
    email: string
    isVerifiedDomain: boolean
    phone: string
    linkedin: string
}

export function AdminInfoCard({
    fullName,
    jobTitle,
    email,
    isVerifiedDomain,
    phone,
    linkedin
}: AdminInfoCardProps) {
    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <ShieldCheck className="text-primary size-5" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Primary Administrator
                </h3>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                    <User className="size-10 text-slate-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 w-full">
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{fullName}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{jobTitle}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Work Email</p>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{email}</p>
                            {isVerifiedDomain && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tight border border-green-200 dark:border-green-800">
                                    Verified Domain
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{phone}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn Profile</p>
                        <a
                            href={linkedin.includes('linkedin.com') ?
                                (linkedin.startsWith('http') ? linkedin : `https://${linkedin}`) :
                                `https://linkedin.com/in/${linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            {linkedin}
                            <ExternalLink className="size-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
