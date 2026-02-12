"use client"

interface SimulationsHeaderProps {
    orgName: string
}

export default function SimulationsHeader({ orgName }: SimulationsHeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between z-10">
            <div className="flex-1 flex items-center gap-4">
                <div className="relative w-full max-w-md group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        search
                    </span>
                    <input
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Search simulations..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-5">
                <button className="relative text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                </button>
                <button className="text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">help</span>
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black leading-none mb-1">{orgName}</p>
                        <p className="text-[11px] text-slate-500">Admin Account</p>
                    </div>
                    <div
                        className="size-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-primary to-purple-600"
                    ></div>
                </div>
            </div>
        </header>
    )
}
