import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHero } from "@/components/auth/AuthHero";
import { PasswordUpdateSuccess } from "@/components/auth/PasswordUpdateSuccess";

export default function PasswordUpdateSuccessPage() {
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
                subtitle="Regain access to over 2 million opportunities bridging the gap between education and the workplace."
                features={[
                    {
                        title: "Resume where you left off",
                        desc: "Continue your progress on tasks that replicate actual work."
                    },
                    {
                        title: "Keep building skills",
                        desc: "Don't lose track of the practical skills you are gaining."
                    }
                ]}
              />
              <PasswordUpdateSuccess />
            </div>
          </main>
          <AuthFooter />
        </div>
    );
}
