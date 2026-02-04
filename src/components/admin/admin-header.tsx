import { Search, Bell, HelpCircle, Menu } from "lucide-react"

export function AdminHeader({ onMenuClick, title = "Super Admin Access Code Dashboard" }: { onMenuClick?: () => void, title?: string }) {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <Menu className="size-6" />
                </button>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                    <span className="hidden md:inline">{title}</span>
                    <span className="md:hidden">Admin Dashboard</span>
                </h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                    <input
                        className="w-full pl-10 pr-4 py-1.5 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        placeholder="Search applications..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Bell className="size-5" />
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <HelpCircle className="size-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}
