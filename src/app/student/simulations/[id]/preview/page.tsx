import { getSimulationDetailsAction } from "@/actions/student/simulation.actions"
import { getOrganizationBranding } from "@/actions/enterprise/enterprise-management.actions"
import { SimulationHero } from "@/components/simulations/SimulationHero"
import { SimulationDetails } from "@/components/simulations/SimulationDetails"
import { SimulationSidebar } from "@/components/simulations/SimulationSidebar"
import { HowItWorks } from "@/components/simulations/HowItWorks"
import { SimulationReviews } from "@/components/simulations/SimulationReviews"
import { StudentHeader } from "@/components/student/StudentHeader"
import Link from "next/link"
import { ArrowLeft, Layers } from "lucide-react"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const details = await getSimulationDetailsAction(resolvedParams.id);
    if (!details.success) {
        return {
            title: "Simulation Preview | Prominent Vantage",
        };
    }
    const { simulation } = details.data;
    return {
        title: `${simulation.title} | Prominent Vantage Simulation`,
        description: simulation.short_description,
        openGraph: {
            title: simulation.title,
            description: simulation.short_description,
            images: [simulation.banner_url || ""],
        },
    };
}

export default async function SimulationPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [detailsResult, brandingResult] = await Promise.all([
        getSimulationDetailsAction(id),
        getOrganizationBranding()
    ]);

    if (!detailsResult.success) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-bold">Error: {detailsResult.error}</p>
                <Link href="/student/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const { simulation, isEnrolled, user } = detailsResult.data;
    const orgBranding = {
        brand_color: simulation.org_brand_color,
        logo_url: simulation.org_logo_url
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] font-sans selection:bg-primary/10 selection:text-primary">
            <StudentHeader userData={{ fullName: user?.fullName || "Student", avatarUrl: user?.avatarUrl }} orgBranding={orgBranding} />

            {/* Back Button */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                    <Link
                        href="/student/library"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Back to Library
                    </Link>
                </div>
            </div>

            <main>
                <SimulationHero
                    simulation={simulation}
                    orgBranding={orgBranding}
                    isEnrolled={isEnrolled}
                />

                {/* Sub-nav */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-40">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex space-x-10 overflow-x-auto no-scrollbar py-6">
                            <a href="#overview" className="text-sm font-black uppercase tracking-widest text-primary border-b-2 border-primary whitespace-nowrap" style={orgBranding?.brand_color ? { color: orgBranding.brand_color, borderColor: orgBranding.brand_color } : {}}>Overview</a>
                            <a href="#about-company" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:text-slate-400 whitespace-nowrap transition-colors">About the Company</a>
                            <a href="#syllabus" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:text-slate-400 whitespace-nowrap transition-colors">Syllabus & Tasks</a>
                            <a href="#reviews" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:text-slate-400 whitespace-nowrap transition-colors">Student Reviews</a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-3 gap-20">
                        <div className="lg:col-span-2 space-y-32">
                            {/* Overview Section */}
                            <div id="overview" className="scroll-mt-32">
                                <SimulationDetails
                                    simulation={simulation}
                                    orgBranding={orgBranding}
                                />
                            </div>

                            {/* About Company Section */}
                            <div id="about-company" className="scroll-mt-32 space-y-12">
                                <div className="flex items-center gap-3">
                                    <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                                    <h2 className="font-display text-3xl font-black    text-slate-900 dark:text-white">About the Company</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
                                        <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white">About {simulation.organization_name}</h3>
                                        <div
                                            className="prose prose-sm dark:prose-invert text-slate-500 dark:text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: simulation.about_company }}
                                        />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8">
                                        <h3 className="font-black text-lg mb-4 text-slate-900 dark:text-white">Why work here?</h3>
                                        <div
                                            className="prose prose-sm dark:prose-invert text-slate-500 dark:text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: simulation.why_work_here }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Syllabus Section */}
                            <div id="syllabus" className="scroll-mt-32">
                                <HowItWorks
                                    orgBranding={orgBranding}
                                    tasks={simulation.tasks}
                                />
                            </div>

                            {/* Reviews Section */}
                            <SimulationReviews
                                orgBranding={orgBranding}
                                reviews={simulation.reviews}
                            />
                        </div>

                        {/* Sticky Sidebar for desktop, stacks on mobile */}
                        <div className="lg:col-span-1">
                            <SimulationSidebar
                                orgName={simulation.organization_name}
                                orgBranding={orgBranding}
                            // aboutCompany and whyWorkHere handled in main flow now
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary/10 rounded flex items-center justify-center" style={orgBranding?.brand_color ? { backgroundColor: `${orgBranding.brand_color}1a` } : {}}>
                                <Layers className="size-5 text-primary" style={orgBranding?.brand_color ? { color: orgBranding.brand_color } : {}} />
                            </div>
                            <span className="font-display font-black text-lg    text-slate-900 dark:text-white uppercase">
                                Prominent Vantage
                            </span>
                        </div>
                        <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Help Center</Link>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Prominent Vantage. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
