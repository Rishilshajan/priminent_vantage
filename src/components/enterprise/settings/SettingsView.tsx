"use client"

import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SettingsNav from "./SettingsNav"
import MFASection from "./MFASection"
import PasswordPolicySection from "./PasswordPolicySection"
import SessionManagementSection from "./SessionManagementSection"
import AuditFooter from "./AuditFooter"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { getSecuritySettingsAction, updateSecuritySettingsAction } from "@/actions/enterprise/security-settings.actions"

interface SettingsViewProps {
    userProfile?: any;
    orgName?: string;
}

export default function SettingsView({ userProfile, orgName }: SettingsViewProps) {
    const [enforceMfaAdmins, setEnforceMfaAdmins] = useState(true);
    const [enforceMfaAll, setEnforceMfaAll] = useState(false);

    // Password Policy State
    const [minPasswordLength, setMinPasswordLength] = useState<number | string>(12);
    const [passwordExpiration, setPasswordExpiration] = useState<number | string>(90);
    const [requireSpecial, setRequireSpecial] = useState(true);
    const [requireNumbers, setRequireNumbers] = useState(true);
    const [requireMixedCase, setRequireMixedCase] = useState(false);

    // Session Policy State
    const [sessionTimeout, setSessionTimeout] = useState(1440);

    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await getSecuritySettingsAction();
            if (result.success && result.data) {
                setEnforceMfaAdmins(result.data.enforce_mfa_admins);
                setEnforceMfaAll(result.data.enforce_mfa_all);

                setMinPasswordLength(result.data.min_password_length || 12);
                setPasswordExpiration(result.data.password_expiration_days || 90);
                setRequireSpecial(result.data.require_special_symbols ?? true);
                setRequireNumbers(result.data.require_numeric_digits ?? true);
                setRequireMixedCase(result.data.require_mixed_case ?? false);

                setSessionTimeout(result.data.session_timeout_minutes || 1440);

                setLastUpdatedAt(result.data.updated_at);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handlePolicyChange = (field: string, value: any) => {
        switch (field) {
            case 'min_password_length': setMinPasswordLength(value); break;
            case 'password_expiration_days': setPasswordExpiration(value); break;
            case 'require_special_symbols': setRequireSpecial(value); break;
            case 'require_numeric_digits': setRequireNumbers(value); break;
            case 'require_mixed_case': setRequireMixedCase(value); break;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateSecuritySettingsAction({
                enforce_mfa_admins: enforceMfaAdmins,
                enforce_mfa_all: enforceMfaAll,
                min_password_length: Number(minPasswordLength) || 12,
                password_expiration_days: Number(passwordExpiration) || 0,
                require_special_symbols: requireSpecial,
                require_numeric_digits: requireNumbers,
                require_mixed_case: requireMixedCase,
                session_timeout_minutes: sessionTimeout
            });

            if (result && result.success) {
                alert("✅ Security policies updated successfully!");
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
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Security & Authentication</h1>
                                <p className="text-slate-500 mt-1 max-w-lg">Manage multi-factor authentication, enterprise password requirements, and session controls.</p>
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
                                <div className="p-12 text-center text-slate-500 italic">Loading security policies...</div>
                            ) : (
                                <>
                                    <MFASection
                                        enforceAdmins={enforceMfaAdmins}
                                        enforceAll={enforceMfaAll}
                                        onEnforceAdminsChange={setEnforceMfaAdmins}
                                        onEnforceAllChange={setEnforceMfaAll}
                                        disabled={isSaving}
                                    />
                                    <PasswordPolicySection
                                        policy={{
                                            min_password_length: Number(minPasswordLength),
                                            password_expiration_days: Number(passwordExpiration),
                                            require_special_symbols: requireSpecial,
                                            require_numeric_digits: requireNumbers,
                                            require_mixed_case: requireMixedCase
                                        }}
                                        onPolicyChange={handlePolicyChange}
                                        disabled={isSaving}
                                    />
                                    <SessionManagementSection
                                        timeoutMinutes={sessionTimeout}
                                        onTimeoutChange={setSessionTimeout}
                                        disabled={isSaving}
                                    />
                                    <AuditFooter
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
