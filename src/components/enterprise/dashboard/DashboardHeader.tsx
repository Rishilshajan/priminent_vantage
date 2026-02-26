"use client"

import { Bell, Search, HelpCircle, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import DashboardSidebar from "./DashboardSidebar"

interface DashboardHeaderProps {
    orgName: string;
    userProfile?: any;
}

export default function DashboardHeader({ orgName, userProfile }: DashboardHeaderProps) {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isSearchOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/enterprise/search?q=${encodeURIComponent(query)}`)
            setIsSearchOpen(false)
        }
    }

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 gap-4">

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="absolute inset-0 bg-white dark:bg-slate-900 z-50 flex items-center px-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            ref={searchInputRef}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4 flex-1">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <button className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Menu className="size-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <DashboardSidebar
                            orgName={orgName}
                            userProfile={userProfile}
                            className="flex border-none w-full h-full static"
                            onLinkClick={() => setIsSidebarOpen(false)}
                        />
                    </SheetContent>
                </Sheet>

                <form onSubmit={handleSearch} className="relative w-full max-w-md group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-full h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        placeholder="Search simulations, reports, or candidates..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center gap-5">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="md:hidden relative text-slate-400 hover:text-primary transition-colors"
                >
                    <Search className="size-5" />
                </button>
                <button className="relative text-slate-400 hover:text-primary transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
                <button className="text-slate-400 hover:text-primary transition-colors">
                    <HelpCircle className="size-5" />
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black leading-none mb-1 text-slate-900 dark:text-white uppercase tracking-tight">{orgName}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">
                            {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? 'Enterprise Admin' : userProfile?.role || 'Member'}
                        </p>
                    </div>
                    {userProfile?.orgLogo || userProfile?.avatar_url ? (
                        <div
                            className="size-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105"
                            style={{ backgroundImage: `url('${userProfile?.orgLogo || userProfile?.avatar_url}')` }}
                        />
                    ) : (
                        <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
