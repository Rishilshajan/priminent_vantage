'use server'

import { candidateService } from "@/lib/candidate/candidate.service";


//Fetches aggregate stats for the candidates engagement dashboard
export async function getCandidateStats() {
    try {
        return await candidateService.getStats();
    } catch (error) {
        return { success: false, error: "Failed to fetch statistics" };
    }
}


//Fetches recent candidate activities
export async function getCandidateActivity(search?: string) {
    try {
        return await candidateService.getActivity(search);
    } catch (error) {
        return { success: false, error: "Failed to fetch activity" };
    }
}
