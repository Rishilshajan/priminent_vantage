"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { RequestHeader } from "./RequestHeader"
import { CompanyInfoCard } from "./CompanyInfoCard"
import { AdminInfoCard } from "./AdminInfoCard"
import { BusinessIntentCard } from "./BusinessIntentCard"
import { ActionReasonDialog } from "./ActionReasonDialog"
import { AdminVerificationSidebar } from "./AdminVerificationSidebar"
import { formatDate } from "@/lib/utils"
import { saveEnterpriseReview, handleEnterpriseAction } from "@/actions/enterprise"

interface RequestDetailsViewProps {
    profile: any
    requestData: any
}

export default function RequestDetailsView({ profile, requestData: data }: RequestDetailsViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [notes, setNotes] = useState(data.admin_notes || "")

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState<"reject" | "clarify">("reject")

    // Helper to extract base domain from URL or Email
    const getDomain = (input: string) => {
        try {
            if (input.includes('@')) {
                return input.split('@')[1].toLowerCase()
            }
            const url = input.replace(/^https?:\/\//, '').replace(/^www\./, '')
            return url.split('/')[0].toLowerCase()
        } catch (e) {
            return ""
        }
    }

    const emailDomain = getDomain(data.admin_email)
    const websiteDomain = getDomain(data.website)
    const isDomainVerified = emailDomain !== "" && emailDomain === websiteDomain

    // Initialize checklist from database or default
    const [checklist, setChecklist] = useState(
        (data.checklist_state && data.checklist_state.length > 0) ? data.checklist_state : [
            { label: `Work domain (${emailDomain || websiteDomain}) verified`, checked: isDomainVerified },
            { label: "LinkedIn Profile manual match", checked: false },
            { label: "Legal Entity exists in global registries", checked: false }
        ]
    )

    // Initialize history from database or default
    const [history, setHistory] = useState(() => {
        const initialHistory = (data.review_history && data.review_history.length > 0) ? data.review_history : [
            { event: "System Intake", date: formatDate(data.created_at), type: "success" as const },
            { event: "Admin Review Started", date: "Just now", type: "warning" as const }
        ]

        // If it's a re-entry (has history beyond the first two), add a 'Session Resumed' entry
        if (data.review_history && data.review_history.length > 0) {
            return [
                ...data.review_history,
                { event: `Review Session Resumed by ${profile.first_name || 'Admin'}`, date: "Just now", type: "warning" as const }
            ]
        }

        return initialHistory
    })

    const handleToggleCheck = (index: number) => {
        setChecklist((prev: any[]) => prev.map((item: any, i: number) =>
            i === index ? { ...item, checked: !item.checked } : item
        ))
    }

    const handleSaveProgress = async () => {
        setIsSaving(true)

        const newEvent = {
            event: `Review Progress Updated by ${profile.first_name || 'Admin'}`,
            date: "Just now",
            type: "warning" as const
        }

        const updatedHistory = [...history, newEvent]
        setHistory(updatedHistory)

        const result = await saveEnterpriseReview(data.id, {
            notes,
            checklist,
            history: updatedHistory
        })

        setIsSaving(false)
        if (result.success) {
            alert("Progress saved and history updated!")
        } else {
            alert("Error saving progress")
        }
    }

    const handleApprove = async () => {
        const newHistory = [
            ...history,
            { event: `Accepted & Issued Access Code by ${profile.first_name || 'Admin'}`, date: "Just now", type: "success" as const }
        ]
        setHistory(newHistory)

        setIsSaving(true)
        const result = await saveEnterpriseReview(data.id, {
            status: 'approved',
            history: newHistory
        })
        setIsSaving(false)

        if (result.success) {
            alert("Request approved and status updated!")
        }
    }

    const openActionDialog = (type: "reject" | "clarify") => {
        setDialogType(type)
        setDialogOpen(true)
    }

    const handleActionSubmit = async (reason: string) => {
        setIsSaving(true)
        const result = await handleEnterpriseAction(
            data.id,
            dialogType,
            reason,
            profile,
            {
                email: data.admin_email,
                companyName: data.company_name,
                adminName: data.admin_name
            }
        )

        if (result.success) {
            setDialogOpen(false)
            setHistory((prev: any[]) => [
                ...prev,
                {
                    event: dialogType === "reject"
                        ? `Rejected by ${profile.first_name || 'Admin'}`
                        : `Clarification Requested by ${profile.first_name || 'Admin'}`,
                    date: "Just now",
                    type: dialogType === "reject" ? "success" as const : "warning" as const
                }
            ])
            alert(`${dialogType === "reject" ? "Rejected" : "Clarification query sent"} successfully!`)
        } else {
            alert(result.error || "Action failed")
        }
        setIsSaving(false)
    }

    const verification = {
        checklist: checklist,
        notes: notes,
        history: history
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black/20">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    title={`Review Request: ${data.company_name}`}
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        <RequestHeader
                            companyName={data.company_name}
                            requestId={data.id.substring(0, 8).toUpperCase()}
                            status={data.status || "Pending"}
                            submittedAt={formatDate(data.created_at)}
                            onApprove={handleApprove}
                            onReject={() => openActionDialog("reject")}
                            onClarify={() => openActionDialog("clarify")}
                        />

                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-12 xl:col-span-8 space-y-8">
                                <CompanyInfoCard
                                    legalName={data.company_name}
                                    country={data.country}
                                    website={data.website.replace(/^https?:\/\//, '')}
                                    industry={data.industry}
                                    companySize={data.company_size}
                                    taxId={data.registration_number}
                                    hqLocation={data.hq_location}
                                    hiringRegions={data.hiring_regions ? [data.hiring_regions] : []}
                                />
                                <AdminInfoCard
                                    fullName={data.admin_name}
                                    jobTitle={data.admin_title}
                                    email={data.admin_email}
                                    isVerifiedDomain={isDomainVerified}
                                    phone={data.admin_phone}
                                    linkedin={data.admin_linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                />
                                <BusinessIntentCard
                                    objectives={data.objectives || []}
                                    description={data.use_case_description || "No description provided."}
                                />
                            </div>
                            <div className="col-span-12 xl:col-span-4">
                                <AdminVerificationSidebar
                                    {...verification}
                                    onToggleCheck={handleToggleCheck}
                                    onNotesChange={setNotes}
                                    onSaveProgress={handleSaveProgress}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ActionReasonDialog
                    isOpen={dialogOpen}
                    onOpenChange={setDialogOpen}
                    type={dialogType}
                    companyName={data.company_name}
                    applicantName={data.admin_name}
                    applicantEmail={data.admin_email}
                    onSubmit={handleActionSubmit}
                    isSubmitting={isSaving}
                />
            </main>
        </div>
    )
}
