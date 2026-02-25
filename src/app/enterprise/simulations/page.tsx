import { Metadata } from "next"
import { getSimulationsMetrics } from "@/actions/enterprise/enterprise-management.actions"
import SimulationsView from "@/components/enterprise/simulations/SimulationsView"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Simulations - Priminent Vantage",
    description: "Manage and track your organization's custom virtual job simulations and learning environments.",
}

export default async function SimulationsPage() {
    const result = await getSimulationsMetrics()

    if (result.error || !result.data) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4 max-w-md">
                    <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">
                        Failed to load simulations
                    </h1>
                    <p className="text-sm text-slate-500">
                        {result.error || "An unexpected error occurred."}
                    </p>
                    <Button
                        asChild
                        className="bg-primary text-white font-bold h-11 px-8 rounded-xl shadow-xl shadow-primary/20"
                    >
                        <a href="/enterprise/dashboard">Return to Dashboard</a>
                    </Button>
                </div>
            </div>
        )
    }

    const { organization, stats, simulations, userProfile } = result.data
    const org = (Array.isArray(organization) ? organization[0] : organization) as any
    const orgName = org?.name || "Organization"

    return <SimulationsView orgName={orgName} stats={stats} simulations={simulations} userProfile={userProfile} />
}
