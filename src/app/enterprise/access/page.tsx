import AccessCodeForm from "@/components/enterprise/AccessCodeForm"
import { Monitor } from "lucide-react"

export default function EnterpriseAccessPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-blue-500/20 rounded-full blur-[120px]" />
            </div>

            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-12 relative z-10 transition-transform active:scale-95 cursor-default">
                <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <Monitor className="size-7" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-none tracking-tight">Priminent</h1>
                    <p className="text-primary text-sm font-black uppercase tracking-[0.2em] mt-1">Vantage</p>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <AccessCodeForm />
            </div>

            <footer className="mt-12 text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                &copy; 2026 Priminent Vantage &bull; Secure Enterprise Onboarding
            </footer>
        </main>
    )
}
