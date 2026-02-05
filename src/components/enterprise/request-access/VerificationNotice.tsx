import { ShieldCheck } from "lucide-react";

export function VerificationNotice() {
    return (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl px-6 py-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">Secure Verification Notice</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400/80 leading-relaxed">
                    All registration requests are manually verified for platform quality and corporate security compliance. Expected response time: 24-48 business hours.
                </p>
            </div>
        </div>
    );
}
