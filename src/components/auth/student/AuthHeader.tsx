import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <GraduationCap className="size-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            Priminent Vantage
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-sm text-muted-foreground">
                            Already have an account?
                        </span>
                        <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5 text-primary hover:text-primary-dark">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
