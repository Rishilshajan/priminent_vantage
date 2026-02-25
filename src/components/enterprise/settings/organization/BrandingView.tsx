"use client"

import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import CoreIdentity from "./CoreIdentity"
import BrandVisuals from "./BrandVisuals"
import EmailBranding from "./EmailBranding"
import CertificateDefaults from "./CertificateDefaults"
import IdentityAuditFooter from "./IdentityAuditFooter"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface BrandingViewProps {
    userProfile?: any;
    orgName?: string;
    initialBranding?: any;
}

import { useState, useEffect } from "react"
import { updateOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions"

export default function BrandingView({ userProfile, orgName, initialBranding }: BrandingViewProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [brandColor, setBrandColor] = useState("#7F13EC");
    const [footerText, setFooterText] = useState("");
    const [senderName, setSenderName] = useState("");
    const [emailFooter, setEmailFooter] = useState("");
    const [directorName, setDirectorName] = useState("");
    const [directorTitle, setDirectorTitle] = useState("");
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [lastUpdatedBy, setLastUpdatedBy] = useState<string | undefined>(undefined);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (initialBranding) {
            setLogoUrl(initialBranding.logo_url || null);
            setBrandColor(initialBranding.brand_color || "#7F13EC");
            setFooterText(initialBranding.footer_text || "");
            setSenderName(initialBranding.email_sender_name || "");
            setEmailFooter(initialBranding.email_footer_text || "");
            setDirectorName(initialBranding.certificate_director_name || "");
            setDirectorTitle(initialBranding.certificate_director_title || "");
            setSignatureUrl(initialBranding.certificate_signature_url || null);
            setLastUpdatedBy(initialBranding.last_updated_by);
            setLastUpdatedAt(initialBranding.last_updated_at);
        }
    }, [initialBranding]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateOrganizationBranding({
                logo_url: logoUrl,
                brand_color: brandColor,
                footer_text: footerText,
                email_sender_name: senderName,
                email_footer_text: emailFooter,
                certificate_director_name: directorName,
                certificate_director_title: directorTitle,
                certificate_signature_url: signatureUrl
            });

            if (result.success) {
                // simple alert for now - replacing toast which was missing
                alert("✅ Organization branding saved successfully!");

                // Optimistically update the audit footer (or we could re-fetch)
                setLastUpdatedBy(userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : "You");
                setLastUpdatedAt(new Date().toISOString());
            } else {
                alert("Failed to save settings: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FC] dark:bg-[#191022]">
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName || "Enterprise"} userProfile={userProfile} />
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
                                <Button
                                    className="h-10 px-5 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <CoreIdentity
                                logoUrl={logoUrl}
                                onLogoChange={setLogoUrl}
                            />
                            <BrandVisuals
                                brandColor={brandColor}
                                footerText={footerText}
                                onBrandColorChange={setBrandColor}
                                onFooterTextChange={setFooterText}
                            />
                            <EmailBranding
                                senderName={senderName}
                                emailFooter={emailFooter}
                                onSenderNameChange={setSenderName}
                                onEmailFooterChange={setEmailFooter}
                            />
                            <CertificateDefaults
                                directorName={directorName}
                                directorTitle={directorTitle}
                                signatureUrl={signatureUrl}
                                onDirectorNameChange={setDirectorName}
                                onDirectorTitleChange={setDirectorTitle}
                                onSignatureChange={setSignatureUrl}
                            />
                            <IdentityAuditFooter
                                lastUpdatedBy={lastUpdatedBy}
                                lastUpdatedAt={lastUpdatedAt}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
