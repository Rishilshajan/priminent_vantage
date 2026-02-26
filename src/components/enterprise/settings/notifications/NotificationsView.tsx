"use client"

import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SettingsNav from "@/components/enterprise/settings/SettingsNav"
import EmailSubscriptionPreferences from "./EmailSubscriptionPreferences"
import CandidateEngagementReports from "./CandidateEngagementReports"
import PushNotifications from "./PushNotifications"
import ConfigurationAuditFooter from "./ConfigurationAuditFooter"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { useState, useEffect } from "react"
import {
    getNotificationSettingsAction,
    updateNotificationSettingsAction,
    sendTestEngagementReportAction
} from "@/actions/enterprise/notification-settings.actions"

interface NotificationsViewProps {
    userProfile?: any;
    orgName?: string;
}

export default function NotificationsView({ userProfile, orgName }: NotificationsViewProps) {
    const [weeklySummary, setWeeklySummary] = useState(true);
    const [newEnrollment, setNewEnrollment] = useState(true);
    const [completionAlert, setCompletionAlert] = useState(false);
    const [reportFrequency, setReportFrequency] = useState('weekly');
    const [pushEnabled, setPushEnabled] = useState(false);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | undefined>(undefined);

    const [isSaving, setIsSaving] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await getNotificationSettingsAction();
            if (result.success && result.data) {
                setWeeklySummary(result.data.weekly_summary);
                setNewEnrollment(result.data.new_enrollment_alert);
                setCompletionAlert(result.data.completion_alert);
                setReportFrequency(result.data.report_frequency || 'weekly');
                setPushEnabled(result.data.push_notifications_enabled || false);
                setLastUpdatedAt(result.data.updated_at);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateNotificationSettingsAction({
                weekly_summary: weeklySummary,
                new_enrollment_alert: newEnrollment,
                completion_alert: completionAlert,
                report_frequency: reportFrequency,
                push_notifications_enabled: pushEnabled
            });

            if (result && result.success) {
                alert("✅ Notification preferences saved successfully!");
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

    const handleGenerateManualReport = async () => {
        setIsSendingTest(true);
        try {
            const result = await sendTestEngagementReportAction(reportFrequency as any);
            if (result && result.success) {
                alert(`✅ ${reportFrequency.charAt(0).toUpperCase() + reportFrequency.slice(1)} summary PDF has been sent to your email!`);
            } else {
                alert("Failed to generate report: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating report.");
        } finally {
            setIsSendingTest(false);
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
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notification Preferences</h1>
                                <p className="text-slate-500 mt-1 max-w-lg">Configure automated communication channels, security alerts, and stakeholder engagement reports.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="h-10 px-5 bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => window.location.reload()}
                                    disabled={isLoading || isSaving || isSendingTest}
                                >
                                    Discard
                                </Button>
                                <Button
                                    className="h-10 px-5 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    onClick={handleSave}
                                    disabled={isLoading || isSaving || isSendingTest}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500 italic">Loading preferences...</div>
                            ) : (
                                <>
                                    <EmailSubscriptionPreferences
                                        weeklySummary={weeklySummary}
                                        newEnrollment={newEnrollment}
                                        completionAlert={completionAlert}
                                        onWeeklySummaryChange={setWeeklySummary}
                                        onNewEnrollmentChange={setNewEnrollment}
                                        onCompletionAlertChange={setCompletionAlert}
                                    />
                                    <CandidateEngagementReports
                                        frequency={reportFrequency}
                                        onFrequencyChange={setReportFrequency}
                                        onGenerateManual={handleGenerateManualReport}
                                        isGenerating={isSendingTest}
                                    />
                                    <PushNotifications
                                        enabled={pushEnabled}
                                        onChange={setPushEnabled}
                                        disabled={isSaving}
                                    />
                                    <ConfigurationAuditFooter
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
