"use client"

import { MapPin, ArrowRight } from "lucide-react"

interface SimulationSidebarProps {
    orgName?: string;
    orgBranding?: any;
    aboutCompany?: string;
    whyWorkHere?: string;
}

export function SimulationSidebar({ orgName = "Global Tech", orgBranding, aboutCompany, whyWorkHere }: SimulationSidebarProps) {
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};

    return (
        <aside className="space-y-8 sticky top-24">
            {/* Sidebar content simplified as About/Why moved to main flow */}

            {/* Related Jobs (Static fallback for now) */}
            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-display font-black text-xl    text-slate-900 dark:text-white">Related Roles</h3>
                    <span className="text-[10px] text-primary font-black px-3 py-1 bg-primary/10 rounded-full uppercase tracking-widest" style={orgBranding?.brand_color ? { color: orgBranding.brand_color, backgroundColor: `${orgBranding.brand_color}1a` } : {}}>
                        Active
                    </span>
                </div>

                <div className="space-y-4">
                    {[
                        { title: "Junior Cloud Engineer", location: "London, UK", type: "Full-time" },
                        { title: "Infrastructure Intern", location: "Remote", type: "Simulation" }
                    ].map((job, index) => (
                        <div
                            key={index}
                            className="block p-5 rounded-[24px] bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 group shadow-sm hover:shadow-md"
                        >
                            <p className="font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{job.title}</p>
                            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase   ">
                                <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {job.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}}>
                <div className="relative z-10">
                    <div className="flex -space-x-3 mb-6">
                        {[1, 2, 3].map((i) => (
                            <img
                                key={i}
                                alt="Student"
                                className="w-12 h-12 rounded-full border-4 border-primary"
                                style={orgBranding?.brand_color ? { borderColor: orgBranding.brand_color } : {}}
                                src={`https://i.pravatar.cc/150?u=${i + 100}`}
                            />
                        ))}
                    </div>
                    <p className="text-lg font-medium italic mb-6 leading-relaxed opacity-90">
                        "This simulation helped me land my first Cloud Engineering role by giving me something concrete to discuss during my technical interview."
                    </p>
                    <p className="font-black text-[10px] uppercase tracking-[0.2em]">— Marcus T., Junior SRE</p>
                </div>
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </div>
        </aside>
    )
}

function groupHoverBrand(brandStyle: any) {
    // This is a helper for inline styles, but Tailwind classes are preferred
    return {};
}
