"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3 relative z-50">
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
                        <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5 text-primary hover:text-primary-dark">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-foreground hover:bg-muted rounded-md"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-background z-40 md:hidden transition-all duration-300 ease-in-out px-6 pt-24 pb-8 flex flex-col",
                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <nav className="flex flex-col gap-6 text-lg font-medium">
                    <Link href="/explore" className="hover:text-primary transition-colors py-2 border-b border-border/50">Explore</Link>
                    <Link href="/jobs" className="hover:text-primary transition-colors py-2 border-b border-border/50">Jobs</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors py-2 border-b border-border/50">Blog</Link>
                    <Link href="/enterprise" className="hover:text-primary transition-colors py-2 border-b border-border/50">For Enterprise</Link>
                    <Link href="/educators" className="hover:text-primary transition-colors py-2 border-b border-border/50">For Educators</Link>
                </nav>

                <div className="mt-auto space-y-4">
                    <Button variant="outline" size="lg" className="w-full text-foreground border-border" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary-dark text-white font-bold shadow-lg" asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
