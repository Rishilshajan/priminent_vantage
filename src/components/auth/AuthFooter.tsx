import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function AuthFooter() {
    return (
        <footer className="bg-background border-t border-border py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="text-primary size-6 bg-primary/10 rounded flex items-center justify-center">
                        <GraduationCap className="size-4" />
                    </div>
                    <span className="font-bold text-foreground text-sm">Priminent Vantage</span>
                </div>
                <div className="flex gap-8 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
                </div>
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Priminent Vantage. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
