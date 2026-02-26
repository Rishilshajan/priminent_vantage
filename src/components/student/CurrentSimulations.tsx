"use client"

import Link from "next/link"
import { Clock, Trophy, Zap } from "lucide-react"

interface CurrentSimulationsProps {
    enrollments: any[];
    orgBranding?: any;
}

export function CurrentSimulations({ enrollments, orgBranding }: CurrentSimulationsProps) {
    const brandColorStyle = orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {};
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};

    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                <p className="text-slate-500 dark:text-gray-400">You are not enrolled in any simulations yet.</p>
                <p className="text-sm text-slate-400">Check the recommendations below to get started.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const checkIfNew = (dateString: string) => {
        const createdDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 20;
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white   ">Current Simulations</h2>
                <Link
                    href="/student/simulations"
                    className="text-sm font-black uppercase tracking-widest text-primary hover:underline dark:text-primary-light"
                    style={brandColorText}
                >
                    View all
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => {
                    const sim: any = Array.isArray(enrollment.simulations) ? enrollment.simulations[0] : enrollment.simulations;
                    if (!sim) return null;

                    const orgData = sim.organizations || sim.organization;
                    const orgName = sim.organization_name ||
                        (Array.isArray(orgData) ? orgData[0]?.name : orgData?.name) ||
                        (sim.org_id ? `Org: ${sim.org_id.substring(0, 8)}...` : "Partner Company");
                    const isNew = checkIfNew(sim.created_at);

                    return (
                        <div key={enrollment.id} className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f162e] shadow-sm hover:shadow-xl transition-all duration-500">
                            {/* Program Banner */}
                            <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                                {sim.banner_url ? (
                                    <img
                                        src={sim.banner_url}
                                        alt={sim.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 opacity-50" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40"></div>

                                {isNew && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="rounded-full bg-[#ff3b30] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                            New
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-black text-lg text-slate-900 dark:text-white    leading-tight group-hover:text-primary transition-colors duration-300 mb-6 line-clamp-2 min-h-[3rem]">
                                        {sim.title}
                                    </h3>

                                    {/* Company Info Section */}
                                    <div className="mb-6">
                                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[20px] border border-slate-100 dark:border-white/5">
                                            <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Partnering Organization</span>
                                            <span className="truncate block text-xl font-black text-slate-900 dark:text-white   er mb-1">
                                                {orgName}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold uppercase   ">
                                                    Published {formatDate(sim.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-6 border-t border-slate-100 dark:border-white/5 pt-6 pb-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                            <span className="text-slate-900 dark:text-white">{enrollment.progress_percentage}% Ready</span>
                                            <span className="text-slate-400">Active</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-500 shadow-[0_0_12px_rgba(127,19,236,0.3)]"
                                                style={{ width: `${enrollment.progress_percentage}%`, ...brandColorStyle }}
                                            />
                                        </div>
                                    </div>

                                    <Link
                                        href={`/student/simulations/${sim.id}/hub`}
                                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_14px_0_rgba(127,19,236,0.39)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(127,19,236,0.23)] active:scale-95"
                                        style={brandColorStyle}
                                    >
                                        <Zap size={16} className="fill-current" />
                                        Enter Task Hub
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
