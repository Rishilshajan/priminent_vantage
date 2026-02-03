"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
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
                            href="#"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Jobs
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Blog
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            For Enterprise
                        </Link>
                        <Link
                            href="#"
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
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                        >
                            Explore
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                        >
                            Jobs
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                        >
                            Blog
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                        >
                            For Enterprise
                        </Link>
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                        >
                            For Educators
                        </Link>
                        <div className="pt-4 flex flex-col space-y-3">
                            <Link
                                href="/login"
                                className="w-full text-center px-4 py-2 rounded-md border border-border hover:bg-muted text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="w-full text-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
