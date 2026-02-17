import { getDashboardMetrics } from "@/actions/enterprise"
import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import StatsCards from "@/components/enterprise/dashboard/StatsCards"
import PerformanceChart from "@/components/enterprise/dashboard/PerformanceChart"
import ActivePrograms from "@/components/enterprise/dashboard/ActivePrograms"
import TopDepartments from "@/components/enterprise/dashboard/TopDepartments"
import ResourceGrid from "@/components/enterprise/dashboard/ResourceGrid"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

export const metadata = {
    title: "Enterprise Dashboard - Prominent Vantage",
}

export default async function EnterpriseDashboardPage({ searchParams }: { searchParams: { period?: string } }) {
    const period = searchParams?.period || 'all';
    const result = await getDashboardMetrics(period);

    if (result.error || !result.data) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4 max-w-md">
                    <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">Failed to load dashboard</h1>
                    <p className="text-sm text-slate-500">{result.error || "An unexpected error occurred."}</p>
                    <Button asChild className="bg-primary text-white font-bold h-11 px-8 rounded-xl shadow-xl shadow-primary/20">
                        <a href="/enterprise/setup">Return to Setup</a>
                    </Button>
                </div>
            </div>
        )
    }

    const { organization, stats, chartData, activePrograms, topDepartments } = result.data;
    const org = (Array.isArray(organization) ? organization[0] : organization) as any;
    const orgName = org?.name || "Organization";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Overview</h1>
                            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider text-[11px]">Real-time performance metrics for {orgName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className={`h-11 px-5 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest transition-all gap-2 ${period === '30d' ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-primary'}`}
                            >
                                <a href={period === '30d' ? '/enterprise/dashboard' : '/enterprise/dashboard?period=30d'}>
                                    <Calendar className="size-4" />
                                    {period === '30d' ? 'Showing 30 Days' : 'Last 30 Days'}
                                </a>
                            </Button>
                            <Button asChild className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2">
                                <a href="/enterprise/simulations/create">
                                    <Plus className="size-5" />
                                    New Simulation
                                </a>
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
                            <TopDepartments departments={topDepartments} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
