"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown, Briefcase, BookOpen, Building2, Compass, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 relative z-50" onClick={() => setIsOpen(false)}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                            P
                        </div>
                        <span className="font-bold text-xl tracking-tight text-primary">
                            Priminent Vantage
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="relative group cursor-pointer py-2">
                            <span className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                                Explore <ChevronDown className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                        <Link
                            href="/jobs"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Jobs
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/enterprise"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            For Enterprise
                        </Link>
                        <Link
                            href="/educators"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            For Educators
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-muted transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center relative z-50">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground hover:text-foreground p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mounted && createPortal(
                <>
                    {/* Mobile Menu Backdrop */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                    )}

                    {/* Mobile Side Drawer */}
                    <aside className={cn(
                        "fixed inset-y-0 left-0 z-[100] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="p-6 flex flex-col h-full">
                            {/* Header in Drawer */}
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                                        P
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                        Vantage
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col gap-2">
                                <Link
                                    href="/explore"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Compass className="size-5" />
                                    Explore
                                </Link>
                                <Link
                                    href="/jobs"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Briefcase className="size-5" />
                                    Jobs
                                </Link>
                                <Link
                                    href="/blog"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <BookOpen className="size-5" />
                                    Blog
                                </Link>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />
                                <Link
                                    href="/enterprise"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Building2 className="size-5" />
                                    For Enterprise
                                </Link>
                                <Link
                                    href="/educators"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <GraduationCap className="size-5" />
                                    For Educators
                                </Link>
                            </nav>

                            {/* Bottom Actions */}
                            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="grid grid-cols-1 gap-3">
                                    <Link
                                        href="/login"
                                        className="w-full text-center px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="w-full text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </>,
                document.body
            )}
        </nav>
    );
}
