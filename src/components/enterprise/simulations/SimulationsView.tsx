import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import SimulationsHeader from "./SimulationsHeader"
import SimulationsStats from "./SimulationsStats"
import SimulationsEmptyState from "./SimulationsEmptyState"
import SimulationsList from "./SimulationsList"

interface SimulationsViewProps {
    orgName: string
    stats: {
        totalEnrollments: number
        activeSimulations: number
        completionRate: number
        skillsAssessed: number
    }
    simulations: any[]
}

export default function SimulationsView({ orgName, stats, simulations }: SimulationsViewProps) {
    const hasSimulations = simulations.length > 0

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <SimulationsHeader orgName={orgName} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950/30 custom-scrollbar">
                    {/* Page Title */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Virtual Job Simulations
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Manage and track your organization&apos;s custom learning environments.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <SimulationsStats stats={stats} />

                    {/* Main Content - Empty State or Simulations List */}
                    {!hasSimulations ? (
                        <SimulationsEmptyState />
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Your Simulations ({simulations.length})
                                </h2>
                            </div>
                            <SimulationsList simulations={simulations} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
