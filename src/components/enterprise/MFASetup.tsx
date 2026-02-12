"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Loader2, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { enrollMFA, verifyMFA } from "@/actions/auth/enterprise.auth";

interface MFASetupProps {
    onComplete: () => void;
    onSkip: () => void;
}

export default function MFASetup({ onComplete, onSkip }: MFASetupProps) {
    const [step, setStep] = useState<"enroll" | "verify">("enroll")
    const [factorId, setFactorId] = useState("")
    const [qrCodeData, setQrCodeData] = useState("")
    const [secret, setSecret] = useState("")
    const [verifyCode, setVerifyCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        startEnrollment()
    }, [])

    const startEnrollment = async () => {
        setIsLoading(true)
        try {
            const result = await enrollMFA()
            if (result.error) {
                setError(result.error)
            } else if (result.success && result.totp) {
                setFactorId(result.id)
                setQrCodeData(result.totp.uri)
                setSecret(result.totp.secret)
            }
        } catch (err) {
            setError("Failed to start MFA enrollment.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        setError(null)
        setIsLoading(true)
        try {
            const result = await verifyMFA(factorId, verifyCode)
            if (result.success) {
                onComplete()
            } else {
                setError(result.error || "Invalid code. Please try again.")
            }
        } catch (err) {
            setError("Verification failed.")
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(secret)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const [imgSrc, setImgSrc] = useState("")

    useEffect(() => {
        if (qrCodeData) {
            import("qrcode").then(QRCode => {
                QRCode.toDataURL(qrCodeData, { width: 200, margin: 2 }, (err, url) => {
                    if (!err) setImgSrc(url)
                })
            })
        }
    }, [qrCodeData])

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
                <div className="mx-auto size-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                    <ShieldCheck className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure your account</h3>
                <p className="text-sm text-slate-500">
                    Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) to enable 2FA.
                </p>
            </div>

            {isLoading && !qrCodeData ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-slate-300" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">
                    {error}
                    <Button variant="link" onClick={startEnrollment} className="block mx-auto mt-2">Retry</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-200">
                        {imgSrc && <img src={imgSrc} alt="MFA QR Code" className="size-48" />}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">Or enter code manually</label>
                        <div className="flex items-center gap-2 justify-center bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-sm">
                            <span>{secret}</span>
                            <button onClick={copyToClipboard} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                {copied ? <CheckCircle2 className="size-4 text-green-500" /> : <Copy className="size-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Authentication Code</label>
                        <Input
                            placeholder="Enter 6-digit code"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="text-center tracking-[0.5em] font-mono text-lg h-12"
                            maxLength={6}
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            onClick={handleVerify}
                            disabled={verifyCode.length !== 6 || isLoading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                        >
                            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Verify & Enable"}
                        </Button>
                        <Button variant="ghost" onClick={onSkip} className="text-slate-400 hover:text-slate-600">
                            Skip for now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
