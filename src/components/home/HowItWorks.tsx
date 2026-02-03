import { UserPlus, BookOpen, GitCompare, Briefcase } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="py-8 bg-background overflow-hidden mb-8 md:mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        How Priminent Vantage Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real tasks, real companies, real career growth. All for free.
                    </p>
                </div>

                <div className="relative">
                    <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 rounded-full"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {/* Step 1 */}
                        <div className="group text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:-translate-y-2 z-10 relative">
                                <UserPlus className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">
                                1. Register
                            </h3>
                            <p className="text-sm text-muted-foreground px-4">
                                Create your profile to unlock access to 300+ career simulations.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:-translate-y-2 z-10 relative">
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">
                                2. Simulate
                            </h3>
                            <p className="text-sm text-muted-foreground px-4">
                                Work through self-paced modules replicating actual job tasks.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:-translate-y-2 z-10 relative">
                                <GitCompare className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">
                                3. Compare
                            </h3>
                            <p className="text-sm text-muted-foreground px-4">
                                Submit your work and see how top professionals would solve it.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="group text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:-translate-y-2 z-10 relative">
                                <Briefcase className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-foreground">
                                4. Get Hired
                            </h3>
                            <p className="text-sm text-muted-foreground px-4">
                                Showcase your certificate to recruiters and land the interview.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
