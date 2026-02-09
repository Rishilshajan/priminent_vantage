import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHero } from "@/components/auth/AuthHero";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <AuthHeader />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <AuthHero
                        title={
                            <>
                                Secure your future <br />
                                <span className="text-primary">career path</span>
                            </>
                        }
                        subtitle="Set a new secure password to regain access to your account."
                        features={[
                            {
                                title: "Strong Security",
                                desc: "Use a mix of characters to keep your account safe."
                            },
                            {
                                title: "Instant Access",
                                desc: "Log in immediately after updating your credentials."
                            }
                        ]}
                    />
                    <UpdatePasswordForm />
                </div>
            </main>
            <AuthFooter />
        </div>
    );
}
