import { Button } from "@/components/ui/button"
import { Upload, Plus, Menu, Search, Bell, HelpCircle } from "lucide-react"

interface CandidatesHeaderProps {
    onMenuClick?: () => void;
}

export default function CandidatesHeader({ onMenuClick }: CandidatesHeaderProps) {
    return (
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#1f1629]/80 backdrop-blur-md border-b border-primary/5 px-4 md:px-8 py-4 md:py-6">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Mobile Top Row with Menu and Icons */}
                <div className="flex items-center justify-between lg:hidden w-full mb-2">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu className="size-6" />
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <Search className="size-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                            <Bell className="size-5" />
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1f1629]"></span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <HelpCircle className="size-5" />
                        </button>
                        <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={onMenuClick}
                            className="hidden md:block lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu className="size-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#140d1b] dark:text-white    leading-none md:leading-normal">Candidates</h2>
                            <p className="text-slate-500 text-[11px] md:text-sm mt-1">Manage and track candidate performance across simulations.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="flex-1 sm:flex-none flex items-center gap-2 px-3 sm:px-4 h-10 bg-primary/10 text-primary font-bold text-xs sm:text-sm rounded-lg hover:bg-primary/20 border-transparent transition-colors">
                            <Upload className="size-3.5 sm:size-4" />
                            <span className="truncate">Export Report</span>
                        </Button>
                        <Button className="flex-1 sm:flex-none flex items-center gap-2 px-3 sm:px-4 h-10 bg-primary text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all">
                            <Plus className="size-3.5 sm:size-4" />
                            <span className="truncate">Add Candidate</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
