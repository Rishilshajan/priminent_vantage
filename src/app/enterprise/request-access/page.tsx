import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { RequestAccessForm } from "@/components/enterprise/request-access/RequestAccessForm";
import { VerificationNotice } from "@/components/enterprise/request-access/VerificationNotice";
import { TrustBadges } from "@/components/enterprise/request-access/TrustBadges";

export default function RequestAccessPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col font-poppins text-foreground selection:bg-primary selection:text-white">
            <AuthHeader />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
                            Enterprise Access Request
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Submit your credentials for manual verification. Our security team reviews all requests to maintain high platform quality for global organizations.
                        </p>
                    </div>

                    <VerificationNotice />

                    <RequestAccessForm />

                    <TrustBadges />
                </div>
            </main>
            <AuthFooter />
        </div>
    );
}
