"use server";

import { enterpriseOnboardingService } from "@/lib/enterprise/enterprise-onboarding.service";

// Validates an enterprise access code and optionally verifies the associated email address
export async function validateAccessCode(code: string, email?: string) {
    try {
        const result = await enterpriseOnboardingService.validateCode(code, email);
        return { success: true, ...result };
    } catch (err: any) {
        return { error: err.message || "Invalid access code." };
    }
}

// Completes the enterprise onboarding flow by provisioning the organization and admin account
export async function completeEnterpriseSetup(setupData: any) {
    try {
        await enterpriseOnboardingService.completeSetup(setupData);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "An unexpected error occurred during final setup." };
    }
}
