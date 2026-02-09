import EnterpriseSetupWizard from "@/components/enterprise/EnterpriseSetupWizard"
import { Monitor } from "lucide-react"

export default function EnterpriseSetupPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-blue-500/20 rounded-full blur-[120px]" />
            </div>

            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <Monitor className="size-6" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">Priminent</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Vantage</p>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-2xl px-4">
                <EnterpriseSetupWizard />
            </div>

            <footer className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
                Secure Enterprise Setup &bull; Protocol v2.4
            </footer>
        </main>
    )
}
