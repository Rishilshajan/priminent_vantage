"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateAccessCode } from "@/actions/enterprise"

export default function AccessCodeForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [code, setCode] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const urlCode = searchParams.get("code")
        const urlEmail = searchParams.get("email")
        if (urlCode) setCode(urlCode)
        if (urlEmail) setEmail(urlEmail)
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const result = await validateAccessCode(code, email)
            if (result.success) {
                // Success - Save metadata to session/local storage for the setup wizard
                sessionStorage.setItem("enterprise_setup_requestId", result.requestId!)
                sessionStorage.setItem("enterprise_setup_companyName", result.companyName!)
                sessionStorage.setItem("enterprise_setup_adminEmail", result.adminEmail!)

                router.push("/enterprise/setup")
            } else {
                setError(result.error || "Validation failed")
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
            <div className="text-center space-y-2">
                <div className="mx-auto size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Enterprise Access
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Validate your organization's access code to begin setup.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">
                            Work Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">
                            Access Code
                        </label>
                        <Input
                            type="text"
                            placeholder="XXX-XXX-XXX"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary text-center font-mono font-bold tracking-[0.2em]"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                        <AlertCircle className="size-4 shrink-0" />
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center gap-2 group shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Validating...
                        </>
                    ) : (
                        <>
                            Enter Workspace
                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                    Access codes are valid for 7 days from approval. <br />
                    Locked to organization domains for security.
                </p>
            </div>
        </div>
    )
}
