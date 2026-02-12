"use client"

import { useState } from "react"
import { EducatorReviewHeader } from "./EducatorReviewHeader"
import { EducationalBackgroundCard } from "./EducationalBackgroundCard"
import { AcademicContextCard } from "./AcademicContextCard"
import { ProfessionalVerificationCard } from "./ProfessionalVerificationCard"
import { VerificationChecklist } from "./VerificationChecklist"
import { InternalAdminNotes } from "./InternalAdminNotes"
import { ReviewHistory } from "./ReviewHistory"
import { saveEducatorReview, handleEducatorAction, updateEducatorApplication } from "@/actions/educator-application.actions"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ActionReasonDialog } from "@/components/admin/enterprise-requests/ActionReasonDialog"
import { getDomainMatch } from "@/lib/utils"

interface EducatorReviewViewProps {
    profile: any;
    application: any;
}

export default function EducatorReviewView({ profile, application }: EducatorReviewViewProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState<"reject" | "clarify">("reject")

    // State for interactive elements
    // State for interactive elements
    const [checklist, setChecklist] = useState(() => {
        const isDomainMatch = getDomainMatch(application.institutional_email, application.institution_website);
        const isApproved = application.status === 'APPROVED';

        const defaultChecklist = [
            {
                label: "Institutional Email Match",
                description: `Strict domain match for @${application.institutional_email.split('@')[1]}`,
                checked: isApproved || isDomainMatch
            },
            { label: "Academic Directory Check", description: "Verified through national educator registry", checked: isApproved },
            { label: "Profile Identity Verify", description: "LinkedIn and document data match applicant", checked: isApproved }
        ];

        try {
            // Priority 1: Use specific verification_checklist column
            if (application.verification_checklist && application.verification_checklist.length > 0) {
                return application.verification_checklist.map((item: any) => ({
                    ...item,
                    checked: isApproved || item.checked || (item.label === "Institutional Email Match" && isDomainMatch)
                }));
            }

            // Priority 2: Use metadata fallback from notes
            const notesData = application.admin_notes ? JSON.parse(application.admin_notes) : [];
            const meta = notesData.find((n: any) => n.__metadata === true);

            if (meta?.verification_checklist && meta.verification_checklist.length > 0) {
                return meta.verification_checklist.map((item: any) => ({
                    ...item,
                    checked: isApproved || item.checked || (item.label === "Institutional Email Match" && isDomainMatch)
                }));
            }

            return defaultChecklist;
        } catch (e) {
            return defaultChecklist;
        }
    })

    const [notes, setNotes] = useState(() => {
        try {
            const parsed = application.admin_notes ? JSON.parse(application.admin_notes) : [];
            // Filter out metadata AND milestone-style notes (those with : or pure APPROVED/REJECTED)
            return Array.isArray(parsed) ? parsed.filter((n: any) =>
                !n.__metadata &&
                n.content &&
                !n.content.includes('APPROVED:') &&
                !n.content.includes('REJECTED:') &&
                !n.content.includes('CLARIFICATION REQUESTED:') &&
                !n.content.includes('Review Started:')
            ) : [];
        } catch (e) {
            return [];
        }
    })

    // Unified History State (Loads all previous milestones + session changes)
    const [history, setHistory] = useState(() => {
        const initialMilestones = [
            { status: "Application Submitted", date: new Date(application.created_at).toLocaleString(), actor: "System" }
        ];

        try {
            const persistedNotes = application.admin_notes ? JSON.parse(application.admin_notes) : [];
            const actionEvents = Array.isArray(persistedNotes)
                ? persistedNotes
                    .filter((n: any) => !n.__metadata && n.content && (n.content.includes(':') || n.content.includes('APPROVED')))
                    .map((n: any) => ({
                        status: n.content,
                        date: n.date,
                        actor: n.author
                    }))
                : [];

            return [...actionEvents, ...initialMilestones].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (e) {
            return initialMilestones;
        }
    })

    const handleToggleCheck = async (index: number) => {
        if (application.status === 'APPROVED' || application.status === 'REJECTED') return;

        const newChecklist = checklist.map((item: any, i: number) =>
            i === index ? { ...item, checked: !item.checked } : item
        )
        setChecklist(newChecklist)

        const allCompleted = newChecklist.every((item: any) => item.checked)
        const moderatorName = `${profile.first_name} ${profile.last_name || ''}`.trim()

        // Only add to history if the WHOLE checklist is now completed
        if (allCompleted) {
            setHistory(prev => [{
                status: "Verification Protocol Completed",
                date: new Date().toLocaleString(),
                actor: moderatorName
            }, ...prev])
        }

        await saveEducatorReview(application.id, { checklist: newChecklist })
    }

    const handleAddNote = async (content: string) => {
        setIsSaving(true)
        const date = new Date().toLocaleString()
        const moderatorName = `${profile.first_name} ${profile.last_name || ''}`.trim()
        const newNote = {
            author: moderatorName,
            date,
            content
        }
        const updatedNotes = [...notes, newNote]
        setNotes(updatedNotes)

        // Add to history dynamically
        setHistory(prev => [{
            status: "Note Added",
            date,
            actor: moderatorName
        }, ...prev])

        await saveEducatorReview(application.id, { notes: updatedNotes })
        setIsSaving(false)
    }

    const handleSaveDraft = async () => {
        setIsSaving(true)
        const result = await saveEducatorReview(application.id, {
            checklist,
            notes
        })
        setIsSaving(false)

        if (result.success) {
            const moderatorName = `${profile.first_name} ${profile.last_name || ''}`.trim()
            setHistory(prev => [{
                status: "Review Draft Saved",
                date: new Date().toLocaleString(),
                actor: moderatorName
            }, ...prev])
            alert("Progress saved as draft.")
        } else {
            alert(`Failed to save draft: ${result.error}`)
        }
    }

    const handleActionSubmit = async (reason: string) => {
        setIsSaving(true)
        const result = await handleEducatorAction(
            application.id,
            dialogType,
            reason,
            profile,
            {
                email: application.institutional_email,
                name: application.full_name,
                institution: application.institution_name
            }
        )
        setIsSaving(false)

        if (result.success) {
            setDialogOpen(false)
            alert(dialogType === 'reject' ? "Application Rejected" : "Clarification Requested")
            window.location.reload()
        } else {
            alert(`Action Failed: ${result.error}`)
        }
    }

    const onHeaderAction = (type: "approve" | "reject" | "clarify") => {
        if (type === 'approve') {
            handleApprove()
        } else {
            setDialogType(type)
            setDialogOpen(true)
        }
    }

    const handleApprove = async () => {
        const isChecklistComplete = checklist.every((item: any) => item.checked)
        if (!isChecklistComplete) {
            alert("Verification Incomplete: Please complete all checklist items before approving.")
            return
        }

        setIsSaving(true)
        const result = await handleEducatorAction(
            application.id,
            "approve",
            "",
            profile,
            {
                email: application.institutional_email,
                name: application.full_name,
                institution: application.institution_name
            }
        )
        setIsSaving(false)

        if (result.success) {
            alert(`Application Approved: ${application.full_name} has been granted educator access.`)
            window.location.reload()
        } else {
            alert(`Approval Failed: ${result.error}`)
        }
    }


    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-black font-display">
            <AdminSidebar
                user={profile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    title={`Review Educator Application`}
                />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto p-4 lg:p-10 space-y-10">
                        {/* Header Section */}
                        <EducatorReviewHeader
                            application={application}
                            onAction={onHeaderAction}
                            isSaving={isSaving}
                        />

                        {/* Layout: Contents in horizontal format (middle), Sidebar on right */}
                        <div className="grid grid-cols-12 gap-10">
                            {/* Middle Column: Contents in horizontal stacks */}
                            <div className="col-span-12 xl:col-span-8 space-y-10">
                                <EducationalBackgroundCard
                                    application={application}
                                />
                                <AcademicContextCard
                                    application={application}
                                />
                                <ProfessionalVerificationCard
                                    application={application}
                                />
                            </div>

                            {/* Right Sidebar: Administrative Panel (Checklist, Notes, History) */}
                            <div className="col-span-12 xl:col-span-4 space-y-10">
                                <VerificationChecklist
                                    checklist={checklist}
                                    onToggle={handleToggleCheck}
                                    disabled={application.status === 'APPROVED' || application.status === 'REJECTED'}
                                />
                                <InternalAdminNotes
                                    notes={notes}
                                    onAddNote={handleAddNote}
                                    isSaving={isSaving}
                                />

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Unfinished review?</p>
                                    <button
                                        onClick={handleSaveDraft}
                                        disabled={isSaving}
                                        className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group shadow-lg"
                                    >
                                        <Save className="size-4 text-slate-400 group-hover:text-white transition-colors" />
                                        {isSaving ? "Saving..." : "Save Progress as Draft"}
                                    </button>
                                </div>

                                <ReviewHistory events={history} />
                            </div>
                        </div>
                    </div>
                </div>

                <ActionReasonDialog
                    isOpen={dialogOpen}
                    onOpenChange={setDialogOpen}
                    type={dialogType}
                    companyName={application.institution_name}
                    applicantName={application.full_name}
                    applicantEmail={application.institutional_email}
                    onSubmit={handleActionSubmit}
                    isSubmitting={isSaving}
                />
            </main>
        </div>
    )
}

import { ShieldCheck, Save } from "lucide-react"
