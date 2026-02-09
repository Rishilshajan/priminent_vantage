"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Sparkles, AlertCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ActionReasonDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    type: "reject" | "clarify"
    companyName: string
    applicantName: string
    applicantEmail: string
    onSubmit: (reason: string) => void
    isSubmitting?: boolean
}

const PRESETS = {
    reject: [
        "Email domain mismatch with official company website.",
        "LinkedIn profile appears suspicious or incomplete.",
        "Use case description is too vague for enterprise access.",
        "Generic or unprofessional domain (e.g., gmail, yahoo) used for business request.",
    ],
    clarify: [
        "Please provide your official company LinkedIn profile URL.",
        "Kindly verify your company registration number (CRN) or Tax ID.",
        "Could you elaborate more on your specific use cases for Vantage?",
        "Please provide a secondary business email for verification.",
    ]
}

export function ActionReasonDialog({
    isOpen,
    onOpenChange,
    type,
    companyName,
    applicantName,
    applicantEmail,
    onSubmit,
    isSubmitting
}: ActionReasonDialogProps) {
    const [reason, setReason] = React.useState("")
    const [showPreview, setShowPreview] = React.useState(false)

    const title = type === "reject" ? "Reject Application" : "Request Clarification"
    const description = type === "reject"
        ? `Are you sure you want to reject ${companyName}? Please provide a reason.`
        : `What information is missing for ${companyName}?`

    const emailSubject = type === "reject"
        ? `Update regarding your Enterprise Request: ${companyName}`
        : `Information Needed: Enterprise Request for ${companyName}`

    const handlePresetClick = (preset: string) => {
        setReason(preset)
    }

    const handleEnhanceWithAI = () => {
        if (!reason) return
        setReason(prev => {
            if (type === "reject") {
                return `After carefully reviewing your application for ${companyName}, we are unable to proceed at this time. Reason: ${prev} If you believe this is an error, please contact support.`
            } else {
                return `We've started reviewing ${companyName}'s request, but we need a bit more information: ${prev} Thank you for your patience.`
            }
        })
    }

    const EmailPreview = () => (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
                {/* Email Headers */}
                <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 space-y-1">
                    <div className="flex text-xs font-medium">
                        <span className="text-slate-400 w-16">To:</span>
                        <span className="text-slate-900 dark:text-slate-200 font-bold">{applicantName} &lt;{applicantEmail}&gt;</span>
                    </div>
                    <div className="flex text-xs font-medium">
                        <span className="text-slate-400 w-16">Subject:</span>
                        <span className="text-slate-900 dark:text-slate-200 font-bold">{emailSubject}</span>
                    </div>
                </div>

                {/* Email Body */}
                <div className="p-6 font-sans text-xs text-slate-600 dark:text-slate-400 max-h-[300px] overflow-y-auto leading-relaxed">
                    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
                        <h2 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            {type === "reject" ? "Application Status Update" : "Clarification Needed"}
                        </h2>
                        <p style={{ marginBottom: '12px' }}>Dear {applicantName},</p>
                        <p style={{ marginBottom: '12px' }}>
                            {type === "reject"
                                ? `Thank you for your interest in Vantage Enterprise. After careful review of your application for <strong>${companyName}</strong>, we are unable to approve your request at this time.`
                                : `We've started reviewing your Enterprise Request for <strong>${companyName}</strong>, but we need a bit more information to proceed with your verification.`
                            }
                        </p>
                        <div style={{
                            backgroundColor: type === "reject" ? '#fef2f2' : '#f0fdfa',
                            padding: '16px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${type === "reject" ? '#ef4444' : '#0d9488'}`,
                            margin: '20px 0'
                        }}>
                            <h4 style={{ margin: '0 0 8px 0', color: type === "reject" ? '#ef4444' : '#0d9488', fontSize: '13px', fontWeight: 'bold' }}>
                                {type === "reject" ? "Reason for rejection:" : "What we need:"}
                            </h4>
                            <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5' }}>{reason || "..."}</p>
                        </div>
                        <p style={{ marginBottom: '12px' }}>
                            {type === "reject"
                                ? "Possible reasons for data-driven rejections often include domain verification issues or incomplete professional profiles. If you believe this is an error, please feel free to reach out to our support team."
                                : "Please reply to this email or provide the requested details to help us complete your request."
                            }
                        </p>
                        <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />
                        <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>&copy; 2026 Priminent Vantage. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {type === "reject" ? (
                                <AlertCircle className="size-5 text-red-500" />
                            ) : (
                                <HelpCircle className="size-5 text-teal-500" />
                            )}
                            <DialogPrimitive.Title className="text-xl font-bold text-slate-900 dark:text-white">
                                {title}
                            </DialogPrimitive.Title>
                        </div>
                        <DialogPrimitive.Close className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                            <X className="size-4" />
                        </DialogPrimitive.Close>
                    </div>

                    {!showPreview ? (
                        <>
                            <DialogPrimitive.Description className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                {description}
                            </DialogPrimitive.Description>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                        {type === "reject" ? "Reason for Rejection" : "Clarification Needed"}
                                    </label>
                                    <Textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={type === "reject" ? "Type the reason here..." : "What do you need them to clarify?"}
                                        className="min-h-[120px] resize-none focus:ring-primary/20 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEnhanceWithAI}
                                            disabled={!reason || isSubmitting}
                                            className="h-8 text-xs font-bold gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                                        >
                                            <Sparkles className="size-3" />
                                            AI Enhance
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPreview(true)}
                                        className="h-8 text-xs font-bold text-slate-500 hover:text-slate-900"
                                    >
                                        Show Preview
                                    </Button>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">Quick Presets</span>
                                    <div className="flex flex-col gap-1.5">
                                        {PRESETS[type].map((preset, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePresetClick(preset)}
                                                className="text-left text-xs p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-950 transition-all font-medium text-slate-600 dark:text-slate-400"
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Detailed Preview</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPreview(false)}
                                    className="h-8 text-xs font-bold text-slate-500 hover:text-slate-800"
                                >
                                    Back to Editor
                                </Button>
                            </div>
                            <EmailPreview />
                            <div className="mt-6 flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                <HelpCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                                    This is exactly what the applicant will receive in their business email. Ensure the information is accurate and professional.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8">
                        {!showPreview ? (
                            <DialogPrimitive.Close asChild>
                                <Button variant="outline" disabled={isSubmitting} className="font-bold">Cancel</Button>
                            </DialogPrimitive.Close>
                        ) : null}
                        <Button
                            variant={type === "reject" ? "destructive" : "default"}
                            disabled={!reason.trim() || isSubmitting}
                            onClick={() => onSubmit(reason)}
                            className={cn(
                                "font-bold shadow-lg transition-all active:scale-95 min-w-[140px] text-white",
                                type === "reject"
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/25"
                                    : "bg-primary hover:bg-primary-hover shadow-primary/25"
                            )}
                        >
                            {isSubmitting ? "Processing..." : (type === "reject" ? "Confirm Rejection" : "Send Query")}
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
