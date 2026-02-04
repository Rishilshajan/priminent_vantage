"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 relative z-50" onClick={() => setIsMenuOpen(false)}>
                            <div className="text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <GraduationCap className="size-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-foreground">
                                Priminent Vantage
                            </span>
                        </Link>

                        {/* Desktop View */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Already have an account?
                            </span>
                            <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5 text-primary">
                                <Link href="/login">Log in</Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden relative z-50 p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={cn(
                    "fixed inset-0 bg-background z-40 md:hidden transition-all duration-300 ease-in-out px-6 flex flex-col justify-between",
                    isMenuOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-full invisible pointer-events-none"
                )}>
                    {/* Navigation Links - Pushed down to clear header */}
                    <nav className="flex flex-col gap-2 mt-24">
                        {["Explore", "Jobs", "Blog", "Enterprise", "Educators"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-xl font-semibold hover:text-primary transition-colors py-4 border-b border-border/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="pb-10 space-y-8">
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" size="lg" className="w-full h-14 text-lg" asChild>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                            </Button>
                            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-bold" asChild>
                                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            </Button>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                                <Rocket className="w-3 h-3 mr-2" />
                                Kickstart your career journey
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                                Your Future. <br />
                                <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                                    Simulated Today.
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}