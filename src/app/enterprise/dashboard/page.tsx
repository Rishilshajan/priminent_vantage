import { getDashboardMetrics } from "@/actions/enterprise/enterprise-management.actions"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import StatsCards from "@/components/enterprise/dashboard/StatsCards"
import PerformanceChart from "@/components/enterprise/dashboard/PerformanceChart"
import ActivePrograms from "@/components/enterprise/dashboard/ActivePrograms"
import TopInstructors from "@/components/enterprise/dashboard/TopInstructors"
import ResourceGrid from "@/components/enterprise/dashboard/ResourceGrid"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

export const metadata = {
    title: "Enterprise Dashboard - Priminent Vantage",
}

export default async function EnterpriseDashboard(props: {
    searchParams: Promise<{ period?: '30d' | 'all', month?: string, year?: string }>
}) {
    const searchParams = await props.searchParams;
    const period = searchParams.period || '30d';
    const month = searchParams.month ? parseInt(searchParams.month) : undefined;
    const year = searchParams.year ? parseInt(searchParams.year) : undefined;

    const response = await getDashboardMetrics(period, month, year);

    if (!response.success || !response.data) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4 max-w-md">
                    <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">Failed to load dashboard</h1>
                    <p className="text-sm text-slate-500">{response.error || "Could not retrieve organization data."}</p>
                    <Button asChild className="bg-primary text-white font-bold h-11 px-8 rounded-xl shadow-xl shadow-primary/20">
                        <a href="/enterprise/setup">Complete Setup</a>
                    </Button>
                </div>
            </div>
        )
    }

    const { organization, stats, chartData, activePrograms, topInstructors, userProfile } = response.data;
    const org = (Array.isArray(organization) ? organization[0] : organization) as any;
    const orgName = org?.name || "Organization";
    const orgLogo = org?.logo_url || null;

    // Attach orgLogo to userProfile for Header's convenience if needed, 
    // but Sidebar expects it separately now.
    const enrichedProfile = userProfile ? { ...userProfile, orgLogo } : null;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName={orgName} userProfile={enrichedProfile as any} orgLogo={orgLogo} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} userProfile={enrichedProfile} />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8 custom-scrollbar">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Overview</h1>
                            <p className="text-[11px] md:text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Real-time performance metrics for {orgName}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className={`h-11 px-5 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest transition-all gap-2 justify-center ${period === '30d' ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-primary'}`}
                            >
                                <a href={period === '30d' ? '/enterprise/dashboard' : '/enterprise/dashboard?period=30d'}>
                                    <Calendar className="size-4" />
                                    {period === '30d' ? 'Showing 30 Days' : 'Last 30 Days'}
                                </a>
                            </Button>
                            <Button
                                className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/25 text-xs font-black uppercase tracking-widest transition-all gap-2 justify-center"
                            >
                                <Plus className="size-4" />
                                New Simulation
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <StatsCards stats={stats} />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Primary Column */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="h-[450px]">
                                <PerformanceChart data={chartData} />
                            </div>
                            <ResourceGrid />
                        </div>

                        {/* Secondary Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <ActivePrograms programs={activePrograms} />
                            <TopInstructors instructors={topInstructors} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
