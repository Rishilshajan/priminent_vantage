import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { EnterpriseHero } from "@/components/enterprise/EnterpriseHero";
import { EnterpriseFeatures } from "@/components/enterprise/EnterpriseFeatures";
import { EnterpriseClients } from "@/components/enterprise/EnterpriseClients";
import { RequestAccessCard } from "@/components/enterprise/RequestAccessCard";

export default function EnterprisePage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins selection:bg-primary selection:text-white">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Column: Content */}
                    <div className="order-2 lg:order-1 flex flex-col justify-center animate-fade-in-up">
                        <EnterpriseHero />
                        <EnterpriseFeatures />
                        <EnterpriseClients />
                    </div>

                    {/* Right Column: Card */}
                    <div className="order-1 lg:order-2 animate-fade-in-up delay-200">
                        <RequestAccessCard />
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
