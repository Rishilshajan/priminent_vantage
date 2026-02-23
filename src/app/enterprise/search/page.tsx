import { searchSimulations } from "@/actions/simulations"
import { getEnterpriseUser } from "@/actions/enterprise"
import { getCandidateActivity } from "@/actions/candidate/candidate.actions" // Reusing this for now as it supports search
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import Link from "next/link"

export const metadata = {
    title: "Search Results - Priminent Vantage",
}

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";

    // Fetch data in parallel
    const [simulationsResult, candidatesResult, userResult] = await Promise.all([
        searchSimulations(query),
        getCandidateActivity(query),
        getEnterpriseUser()
    ]);

    const simulations = simulationsResult.data || [];
    const candidates = 'data' in candidatesResult ? candidatesResult.data : [];
    const userProfile = userResult?.userProfile || null;
    const orgName = userResult?.orgName || "Enterprise";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} userProfile={userProfile} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Search Results</h1>
                        <p className="text-sm text-slate-500">Showing results for "{query}"</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Simulations Results */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Simulations ({simulations.length})</h2>
                            {simulations.length > 0 ? (
                                <div className="space-y-3">
                                    {simulations.map((sim: any) => (
                                        <Link href={`/enterprise/simulations/${sim.id}`} key={sim.id} className="block group">
                                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{sim.title}</h3>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sim.description}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${sim.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {sim.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                                    <p className="text-sm text-slate-500">No simulations found.</p>
                                </div>
                            )}
                        </div>

                        {/* Candidates Results */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Candidates ({candidates.length})</h2>
                            {candidates.length > 0 ? (
                                <div className="space-y-3">
                                    {candidates.map((activity: any) => (
                                        <div key={activity.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                                {activity.candidate.avatar ? (
                                                    <img src={activity.candidate.avatar} alt="" className="size-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-500">
                                                        {activity.candidate.name.substring(0, 2).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activity.candidate.name}</h3>
                                                <p className="text-xs text-slate-500">{activity.candidate.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                                    <p className="text-sm text-slate-500">No candidates found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
