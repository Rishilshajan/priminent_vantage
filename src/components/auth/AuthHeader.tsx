"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, Home, Briefcase, BookOpen, Building2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const isActive = (path: string) => {
        if (path === '/signup' && (pathname === '/' || pathname === '/login' || pathname === '/signup')) return true;
        if (path === '/educators/signup' && pathname?.startsWith('/educators')) return true;
        return pathname?.startsWith(path);
    };

    // Determine which login/signup links to show based on current page
    const isEducatorPage = pathname?.startsWith('/educators');
    const loginHref = isEducatorPage ? '/educators/login?next=/educators/dashboard' : '/login';
    const signupHref = isEducatorPage ? '/educators/signup?next=/educators/dashboard' : '/signup';

    const navItems = [
        { name: "For Candidates", href: "/signup" },
        { name: "For Enterprise", href: "/enterprise" },
        { name: "For Educators", href: "/educators/signup" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Area */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2.5 relative z-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="text-white size-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <GraduationCap className="size-5" />
                            </div>
                            <span className="text-xl font-bold    text-foreground">
                                Priminent Vantage
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-all duration-200 relative py-2",
                                    isActive(item.href)
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground hover:bg-transparent" asChild>
                            <Link href={loginHref}>Log In</Link>
                        </Button>
                        <Button className="font-semibold shadow-lg shadow-primary/20" asChild>
                            <Link href={signupHref}>Sign Up</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {mounted && createPortal(
                <>
                    {/* Mobile Menu Backdrop */}
                    {isMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    )}

                    {/* Mobile Side Drawer */}
                    <aside className={cn(
                        "fixed inset-y-0 left-0 z-[100] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="p-6 flex flex-col h-full">
                            {/* Header in Drawer */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="text-white size-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                                        <GraduationCap className="size-4" />
                                    </div>
                                    <span className="font-bold text-lg    text-slate-900 dark:text-white">
                                        Vantage
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.href === '/signup' ? <Home className="size-5" /> : null}
                                        {item.href === '/enterprise' ? <Building2 className="size-5" /> : null}
                                        {item.href === '/educators' ? <GraduationCap className="size-5" /> : null}
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />
                                <Link
                                    href="/explore"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Compass className="size-5" />
                                    Explore
                                </Link>
                                <Link
                                    href="/jobs"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Briefcase className="size-5" />
                                    Jobs
                                </Link>
                                <Link
                                    href="/blog"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <BookOpen className="size-5" />
                                    Blog
                                </Link>
                            </nav>

                            {/* Bottom Actions */}
                            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="grid grid-cols-1 gap-3">
                                    <Button variant="outline" size="sm" className="w-full justify-center text-sm font-medium border-slate-200 dark:border-slate-800" asChild>
                                        <Link href={loginHref} onClick={() => setIsMenuOpen(false)}>Log In</Link>
                                    </Button>
                                    <Button size="sm" className="w-full justify-center text-sm font-bold shadow-lg shadow-primary/20" asChild>
                                        <Link href={signupHref} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </>,
                document.body
            )}
        </header>
    );
}