"use client"

import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import CoreIdentity from "./CoreIdentity"
import BrandVisuals from "./BrandVisuals"
import EmailBranding from "./EmailBranding"
import CertificateDefaults from "./CertificateDefaults"
import CommonBrandAssets from "./CommonBrandAssets"
import IdentityAuditFooter from "./IdentityAuditFooter"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function BrandingView() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <SettingsNav />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto p-6 md:p-10">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                                    <Link href="/enterprise/settings/organization" className="hover:text-primary transition-colors">Organization</Link>
                                    <ChevronRight className="size-3" />
                                    <span className="text-slate-600 dark:text-slate-300">Branding & Identity</span>
                                </nav>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organization Branding</h1>
                                <p className="text-slate-500 mt-1 max-w-lg">Customize your corporate identity across simulations, emails, and candidate certificates.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="h-10 px-5 bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Discard
                                </Button>
                                <Button className="h-10 px-5 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <CoreIdentity />
                            <BrandVisuals />
                            <EmailBranding />
                            <CertificateDefaults />
                            <CommonBrandAssets />
                            <IdentityAuditFooter />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
