"use client"

import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import DataRetentionPolicy from "./DataRetentionPolicy"
import GDPRCompliance from "./GDPRCompliance"
import CandidateDataPrivacy from "./CandidateDataPrivacy"
import DataPortability from "./DataPortability"
import PrivacyAuditFooter from "./PrivacyAuditFooter"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { getPrivacySettingsAction, updatePrivacySettingsAction } from "@/actions/enterprise/privacy-settings.actions"

interface PrivacyViewProps {
    userProfile?: any;
    orgName?: string;
}

export default function PrivacyView({ userProfile, orgName }: PrivacyViewProps) {
    const [retentionPeriod, setRetentionPeriod] = useState('6_months');
    const [enableGdpr, setEnableGdpr] = useState(false);
    const [rtbfAutomation, setRtbfAutomation] = useState(false);
    const [anonymizeNames, setAnonymizeNames] = useState(false);
    const [restrictAccess, setRestrictAccess] = useState(true);

    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await getPrivacySettingsAction();
            if (result.success && result.data) {
                setRetentionPeriod(result.data.data_retention_period || '6_months');
                setEnableGdpr(result.data.enable_gdpr_mode);
                setRtbfAutomation(result.data.right_to_be_forgotten_automation);
                setAnonymizeNames(result.data.anonymize_candidate_names);
                setRestrictAccess(result.data.restrict_data_access);
                setLastUpdatedAt(result.data.updated_at);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updatePrivacySettingsAction({
                data_retention_period: retentionPeriod,
                enable_gdpr_mode: enableGdpr,
                right_to_be_forgotten_automation: rtbfAutomation,
                anonymize_candidate_names: anonymizeNames,
                restrict_data_access: restrictAccess
            });

            if (result && result.success) {
                alert("✅ Privacy policies updated successfully!");
                setLastUpdatedAt(new Date().toISOString());
            } else {
                alert("Failed to save settings: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const userName = userProfile?.full_name || userProfile?.first_name ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : "Admin";

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
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Data & Privacy Settings</h1>
                                <p className="text-slate-500 mt-1 max-w-lg">Configure global data handling, retention policies, and regulatory compliance standards.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="h-10 px-5 bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                                    disabled={isLoading || isSaving}
                                    onClick={() => window.location.reload()}
                                >
                                    Discard
                                </Button>
                                <Button
                                    className="h-10 px-5 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    disabled={isLoading || isSaving}
                                    onClick={handleSave}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500 italic">Loading privacy policies...</div>
                            ) : (
                                <>
                                    <DataRetentionPolicy
                                        value={retentionPeriod}
                                        onChange={setRetentionPeriod}
                                        disabled={isSaving}
                                    />
                                    <GDPRCompliance
                                        gdprMode={enableGdpr}
                                        onGdprModeChange={setEnableGdpr}
                                        rtbfAutomation={rtbfAutomation}
                                        onRtbfAutomationChange={setRtbfAutomation}
                                        disabled={isSaving}
                                    />
                                    <CandidateDataPrivacy
                                        anonymizeNames={anonymizeNames}
                                        onAnonymizeNamesChange={setAnonymizeNames}
                                        restrictAccess={restrictAccess}
                                        onRestrictAccessChange={setRestrictAccess}
                                        disabled={isSaving}
                                    />
                                    <DataPortability />
                                    <PrivacyAuditFooter
                                        lastUpdatedBy={userName}
                                        lastUpdatedAt={lastUpdatedAt}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
