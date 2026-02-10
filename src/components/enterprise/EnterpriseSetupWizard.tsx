"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    UserPlus,
    ShieldCheck,
    Building2,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Lock,
    Globe,
    Eye,
    EyeOff,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "../ui/progress"
// Checkbox import restored
import { Checkbox } from "@/components/ui/checkbox"
import { completeEnterpriseSetup } from "@/actions/enterprise"
import MFASetup from "./MFASetup"

type Step = "account" | "organization" | "mfa" | "completion"

export default function EnterpriseSetupWizard() {
    const router = useRouter()

    // Metadata from access validation
    const [metadata, setMetadata] = useState<{
        requestId: string;
        companyName: string;
        adminEmail: string;
    } | null>(null)

    const [currentStep, setCurrentStep] = useState<Step>("account")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    // enableMFA state restored
    const [enableMFA, setEnableMFA] = useState(true)

    // Form Data
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        companyName: "",
        industry: "",
        companySize: "",
        website: ""
    })

    useEffect(() => {
        const requestId = sessionStorage.getItem("enterprise_setup_requestId")
        const companyName = sessionStorage.getItem("enterprise_setup_companyName")
        const adminEmail = sessionStorage.getItem("enterprise_setup_adminEmail")
        const adminName = sessionStorage.getItem("enterprise_setup_adminName")
        const industry = sessionStorage.getItem("enterprise_setup_industry")
        const companySize = sessionStorage.getItem("enterprise_setup_companySize")
        const website = sessionStorage.getItem("enterprise_setup_website")

        if (!requestId || !adminEmail) {
            router.push("/enterprise/login")
            return
        }

        setMetadata({ requestId, companyName: companyName || "Your Organization", adminEmail })

        // Pre-fill name and organization data
        const parts = adminName?.trim().split(/\s+/) || []
        const firstName = parts[0] || ""
        const lastName = parts.slice(1).join(" ") || ""

        setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            companyName: companyName || "",
            industry: industry || "",
            companySize: companySize || "",
            website: website || ""
        }))
    }, [router])

    const handleNext = () => {
        if (currentStep === "account") setCurrentStep("organization")
        else if (currentStep === "organization") handleComplete()
    }

    const handleBack = () => {
        if (currentStep === "organization") setCurrentStep("account")
    }

    const handleComplete = async () => {
        if (!metadata) return

        setError(null)
        setIsLoading(true)

        try {
            const result = await completeEnterpriseSetup({
                requestId: metadata.requestId,
                email: metadata.adminEmail,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                companyName: formData.companyName,
                industry: formData.industry,
                companySize: formData.companySize,
                website: formData.website
            })

            if (result.success) {
                // Clear Access Code Session Data
                sessionStorage.removeItem("enterprise_setup_requestId")
                sessionStorage.removeItem("enterprise_setup_companyName")
                sessionStorage.removeItem("enterprise_setup_adminEmail")

                if (enableMFA) {
                    setCurrentStep("mfa")
                } else {
                    setCurrentStep("completion")
                }
            } else {
                setError(result.error || "Failed to complete setup")
            }
        } catch (err) {
            setError("An unexpected error occurred during setup.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!metadata) return null

    // Progress calculation
    // Total steps: Account(1), Organization(2). MFA(3) is optional. Completion(4).
    // If MFA is disabled: Account(1) -> Organization(2) -> Completion(3)
    // Steps for Progress Bar:
    // With MFA: 4 steps. 25, 50, 75, 100
    // Without MFA: 3 steps. 33, 66, 100

    let progress = 0;
    if (enableMFA) {
        if (currentStep === "account") progress = 25;
        else if (currentStep === "organization") progress = 50;
        else if (currentStep === "mfa") progress = 75;
        else progress = 100;
    } else {
        if (currentStep === "account") progress = 33;
        else if (currentStep === "organization") progress = 66;
        else progress = 100;
    }

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            {/* Header / Progress */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Onboarding</h2>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {currentStep === "account" && (sessionStorage.getItem("enterprise_setup_isUserExists") === "true" ? "Sign In to Organization" : "Create Admin Account")}
                            {currentStep === "organization" && "Organization Profile"}
                            {currentStep === "mfa" && "Secure Account"}
                            {currentStep === "completion" && "Setup Complete!"}
                        </h1>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            Step {
                                currentStep === "account" ? "1" :
                                    currentStep === "organization" ? "2" :
                                        currentStep === "mfa" ? "3" :
                                            enableMFA ? "4" : "3"
                            } of {enableMFA ? "4" : "3"}
                        </span>
                        <div className="flex gap-1 justify-end">
                            <div className={`size-1.5 rounded-full ${currentStep === "account" ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
                            <div className={`size-1.5 rounded-full ${currentStep === "organization" ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
                            {enableMFA && (
                                <div className={`size-1.5 rounded-full ${currentStep === "mfa" ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
                            )}
                            <div className={`size-1.5 rounded-full ${currentStep === "completion" ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
                        </div>
                    </div>
                </div>
                <Progress value={progress} className="h-1.5 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="p-6 md:p-8">
                {currentStep === "account" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                <Input
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    disabled
                                    className="h-11 bg-slate-100 dark:bg-slate-800/80 border-dashed cursor-not-allowed opacity-70"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                <Input
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    disabled
                                    className="h-11 bg-slate-100 dark:bg-slate-800/80 border-dashed cursor-not-allowed opacity-70"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative">
                                <Input
                                    value={metadata.adminEmail}
                                    disabled
                                    className="h-11 bg-slate-100 dark:bg-slate-800/80 border-dashed cursor-not-allowed opacity-70"
                                />
                                <Lock className="absolute right-3 top-3 size-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                {sessionStorage.getItem("enterprise_setup_isUserExists") === "true" ? "Confirm Password" : "Set Password"}
                            </label>                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-11 bg-slate-50 dark:bg-slate-800/50 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex gap-3">
                            <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                Use a strong password with symbols and numbers. This account will be the <strong>Primary Admin</strong> for {metadata.companyName}.
                            </p>
                        </div>
                    </div>
                )}

                {currentStep === "organization" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Company Name</label>
                            <Input
                                placeholder="Company Name"
                                value={formData.companyName || metadata.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="h-11 bg-slate-50 dark:bg-slate-800/50"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry</label>
                                <Input
                                    placeholder="Industry"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Size</label>
                                <Input
                                    placeholder="Company Size"
                                    value={formData.companySize}
                                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                                    className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Website (Public)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 size-4 text-slate-400" />
                                <Input
                                    placeholder="https://company.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-800/50"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="mfa"
                                    checked={enableMFA}
                                    onCheckedChange={(checked) => setEnableMFA(checked as boolean)}
                                    className="mt-0.5"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="mfa"
                                        className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Enable Multi-Factor Authentication (MFA)
                                    </label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        We strongly recommend allowing this for enhanced security. You can enforce this policy later in the dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === "mfa" && (
                    <MFASetup
                        onComplete={() => setCurrentStep("completion")}
                        onSkip={() => setCurrentStep("completion")}
                    />
                )}

                {currentStep === "completion" && (
                    <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                        <div className="mx-auto size-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center border-4 border-green-50 dark:border-green-900/30">
                            <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Aboard!</h2>
                            <p className="text-slate-500 font-medium px-12">
                                Your organization dashboard for <strong>{metadata.companyName}</strong> is now ready. You can start inviting team members and managing your assets.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/enterprise/dashboard")}
                            className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/20 flex items-center gap-2 mx-auto"
                        >
                            Go to Dashboard
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                        <AlertCircle className="size-5 shrink-0" />
                        {error}
                    </div>
                )}
            </div>

            {currentStep !== "completion" && currentStep !== "mfa" && (
                <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center bg-slate-50/30 dark:bg-slate-800/10">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === "account" || isLoading}
                        className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={isLoading || (currentStep === "account" && !formData.password)}
                        className="w-full sm:w-auto h-11 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {currentStep === "organization" ? (enableMFA ? "Next: Secure Account" : "Complete Setup") : "Continue"}
                                <ArrowRight className="size-4" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
