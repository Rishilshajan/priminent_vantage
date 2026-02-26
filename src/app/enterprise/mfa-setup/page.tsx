"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import MFASetup from "@/components/enterprise/MFASetup";
import { createClient } from "@/lib/supabase/client";

export default function EnterpriseMFASetupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function checkEnforcement() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/enterprise/signin");
                return;
            }

            // Check if MFA is actually required for this user
            const { data: membership } = await supabase
                .from("organization_members")
                .select("org_id, role")
                .eq("user_id", user.id)
                .maybeSingle();

            if (membership) {
                const { data: settings } = await supabase
                    .from("enterprise_security_settings")
                    .select("enforce_mfa_admins, enforce_mfa_all")
                    .eq("org_id", membership.org_id)
                    .maybeSingle();

                const isAdmin = ["admin", "enterprise_admin", "owner"].includes(membership.role);
                const isMfaEnforced = settings?.enforce_mfa_all || (settings?.enforce_mfa_admins && isAdmin);

                if (!isMfaEnforced) {
                    console.log("[MFA-SETUP] Bypassing setup as it is not enforced for this user.");
                    router.push("/enterprise/dashboard");
                    return;
                }

                // If enforced, check if they already have factors
                const { data: factors } = await supabase.auth.mfa.listFactors();
                if (factors?.all && factors.all.length > 0) {
                    console.log("[MFA-SETUP] User already has MFA factors, redirecting to verify.");
                    router.push("/enterprise/mfa-verify");
                    return;
                }
            }

            setIsLoading(false);
        }

        checkEnforcement();
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[800px] bg-primary/5 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"></div>

                <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border animate-fade-in-up">
                    <MFASetup
                        onComplete={() => router.push("/enterprise/dashboard")}
                        onSkip={() => router.push("/enterprise/signin")}
                    />
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
