"use server"

import { reportService, ImpactReportData } from "@/lib/reports/report.service"

export type { ImpactReportData }

// Fetches a full impact report for a simulation including completion rates, skill outcomes, and assessments
export async function getSimulationImpactReport(simulationId: string): Promise<{ data: ImpactReportData | null; error: string | null }> {
    try {
        const data = await reportService.getSimulationImpactReport(simulationId)
        return { data, error: null }
    } catch (error: any) {
        console.error("Error fetching impact report:", error)
        return { data: null, error: error.message || "Failed to fetch impact report" }
    }
}
