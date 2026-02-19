"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ImpactReportData {
    simulation: {
        id: string
        title: string
        status: string
        banner_url: string | null
        created_at: string
    }
    stats: {
        totalEnrolled: number
        enrolledTrend: number
        completionRate: number
        completionTrend: number
        avgScore: number
        scoreTrend: number
        medianTime: string
        timeTrend: number
    }
    funnel: Array<{
        step: string
        label: string
        count: number
        percentage: number
        description: string
    }>
    skills: Array<{
        name: string
        mastery: number // 0-100
    }>
    institutions: Array<{
        name: string
        count: number
        percentage: number
    }>
    regions: Array<{
        name: string
        percentage: number
    }>
    topTalent: Array<{
        id: string
        name: string
        institution: string
        score: number
        completionDate: string
        avatar_url: string | null
        location: string
    }>
}

export async function getSimulationImpactReport(simulationId: string): Promise<{ data: ImpactReportData | null; error: string | null }> {
    const supabase = await createClient()

    try {
        // Fetch simulation details
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('*')
            .eq('id', simulationId)
            .single()

        if (simError) throw simError

        // Mock data for initial implementation matching the provided requirements
        // In a real production scenario, these would be aggregated from enrollment and task_submission tables
        const reportData: ImpactReportData = {
            simulation: {
                id: simulation.id,
                title: simulation.title,
                status: simulation.status,
                banner_url: simulation.banner_url,
                created_at: simulation.created_at,
            },
            stats: {
                totalEnrolled: 12450,
                enrolledTrend: 12.4,
                completionRate: 68.4,
                completionTrend: 2.1,
                avgScore: 82.1,
                scoreTrend: -0.5,
                medianTime: "4h 12m",
                timeTrend: 5,
            },
            funnel: [
                { step: "Enrolled", label: "Task 1: Onboarding", count: 12450, percentage: 100, description: "Candidates enrolled in simulation" },
                { step: "Retained", label: "Task 2: Data Cleaning", count: 11454, percentage: 92, description: "Completed initial setup" },
                { step: "Retained", label: "Task 3: DCF Modeling", count: 10084, percentage: 81, description: "Completed core analysis" },
                { step: "Retained", label: "Task 4: Valuation", count: 9213, percentage: 74, description: "Completed valuation phase" },
                { step: "Completed", label: "Task 5: Final Presentation", count: 8466, percentage: 68, description: "Submitted final report" },
            ],
            skills: [
                { name: "Excel Modeling", mastery: 95 },
                { name: "DCF Valuation", mastery: 65 },
                { name: "Market Research", mastery: 45 },
                { name: "Attention to Detail", mastery: 85 },
                { name: "Comm. (Reporting)", mastery: 90 },
            ],
            institutions: [
                { name: "London School of Economics", count: 1450, percentage: 11.6 },
                { name: "Wharton School", count: 1210, percentage: 9.7 },
                { name: "INSEAD", count: 980, percentage: 7.8 },
                { name: "Harvard University", count: 850, percentage: 6.8 },
            ],
            regions: [
                { name: "EMEA", percentage: 42 },
                { name: "AMER", percentage: 35 },
                { name: "APAC", percentage: 23 },
            ],
            topTalent: [
                {
                    id: "1",
                    name: "Sarah Jenkins",
                    institution: "London School of Economics",
                    score: 99.2,
                    completionDate: "Oct 14, 2024",
                    location: "London, UK",
                    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTe1H0nLH0j2OX1F9XiLXmZ9kJlbFUJGsDkcLndhZL8WicAU7c1_bpjWDgQEgicMY8z3TfqYaTtDYlATz7D1-y_axatee0q3eLIQ_dFAIdtBsCqGDL7lUS_CR82bbGQA3rhsCYdkS4_cbHYY6PdoAuOdKXbJ4aZdWIw9wzs_r-2CRAWkddBamvWADQDhzWT9ai84uNyimbsykgLAV1n4cajVY9h_49s1Tt7gSR0Be1hNd8Dro-GsBz6ZvlpOLBOhBB2EY_XxtNVGU",
                },
                {
                    id: "2",
                    name: "Michael Zhang",
                    institution: "Wharton School",
                    score: 98.5,
                    completionDate: "Oct 12, 2024",
                    location: "New York, USA",
                    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmoFiqELqff-KGD5k5yVXpg9Gai5VtAGeqnZ9zHwJBMXorQP_MCAnju85LKzkKnA9a8a_QnFl141Dzz88swLaR1EhyIHVMdW5lAVuwcYRCcju8QM-d665VIpwR6GYZ27h5bul_gUpAjcMg9m8NgkZjCv7lUvUMByw8Gr3ZsZTr67y1HX5IBCINZ6axGRoWgHOA8N4oOVmNz1eP_HPhaAtV8gedbNT2ye3dTsibslU3WPl7zZV1dkDOMZsfqrIz3nMgOL3wTOBbT2o",
                },
                {
                    id: "3",
                    name: "Amara Okafor",
                    institution: "INSEAD",
                    score: 97.9,
                    completionDate: "Oct 15, 2024",
                    location: "Lagos, Nigeria",
                    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu4zT5da12EPHvcROYJG8eqdqWJHIVnAx40R4HWXC-R1nbBOyIcD4TsTXMju8BRfuVSOcQGDzQtZ73M8_6DGXqkbvYXp1yTfkIoUaYECRbVAy9zTp67q53SoR4Y04hfN9hVdoEAMcZ49guxLPpG8TvhLpQLxm6xIkGOtrpwjm645-_s8YKbECpuBOVvbO1eXwlJvTVuLAI94u8OSfIiAIndEsLe3JfV9YB2SlOYVTuv6P5e-JX5jyD_v5Nt3shSqiZL-Y-Y87n3bA",
                },
                {
                    id: "4",
                    name: "James McAvoy",
                    institution: "University of Sydney",
                    score: 96.4,
                    completionDate: "Oct 10, 2024",
                    location: "Sydney, Australia",
                    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8rSNEz90WbmHFXUxm46OjdJQ9KXjEsIKRO-CRs8jJNQ68IOq_mSuktwub2GaZChB_GFy1Xl2QPP0l5uhWjj_g58fBg_HQHxUq49UQhAZPLMiW9sjFumW5JerQczsf6CLukev2stsVquLpEm3lifrfrZXIFSYwghYr71QLtgE1QAaj-3hUxyG7S6dqjSuAiMM27BZHa6VT6bBBXkw4JDvwKzuPdaZteRdA2X4uMcARVdCCkJoyJsfV5dBR8PwJ1Sz0V3KWRW354-w",
                },
            ],
        }

        return { data: reportData, error: null }
    } catch (error: any) {
        console.error("Error fetching impact report:", error)
        return { data: null, error: error.message || "Failed to fetch impact report" }
    }
}
