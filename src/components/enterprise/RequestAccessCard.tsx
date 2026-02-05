"use client";

import Link from "next/link";
import { Key, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RequestAccessCard() {
    return (
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <Key className="size-10 text-primary" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
                Request Enterprise Access
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
                Ready to access our talent pool? Join the leading companies hiring with Prominent Vantage.
            </p>

            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/30 group mb-8" asChild>
                <Link href="/enterprise/request-access">
                    Request Access
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>

            <div className="w-full border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                    Already have an enterprise account?{" "}
                    <Link href="/enterprise/login" className="text-primary font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
