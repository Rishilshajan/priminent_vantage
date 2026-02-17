import DashboardSidebar from "@/components/enterprise/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/enterprise/dashboard/DashboardHeader"
import SimulationsStats from "./SimulationsStats"
import SimulationsEmptyState from "./SimulationsEmptyState"
import SimulationsList from "./SimulationsList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SimulationsViewProps {
    orgName: string
    stats: {
        totalEnrollments: number
        activeSimulations: number
        completionRate: number
        skillsAssessed: number
    }
    simulations: any[]
    userProfile?: any
}

export default function SimulationsView({ orgName, stats, simulations, userProfile }: SimulationsViewProps) {
    const hasSimulations = simulations.length > 0

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar orgName={orgName} userProfile={userProfile} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DashboardHeader orgName={orgName} userProfile={userProfile} />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950/30 custom-scrollbar">
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
                        <Button
                            asChild
                            className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/25 text-xs font-black uppercase tracking-widest transition-all gap-2 justify-center"
                        >
                            <a href="/enterprise/simulations/create">
                                <Plus className="size-4" />
                                New Simulation
                            </a>
                        </Button>
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
