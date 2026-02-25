'use server';

import { OnboardingService, UpdateBasicIdentityParams, UpdateAcademicBackgroundParams, UpdateProfessionalExperienceParams } from '@/lib/student/onboarding.service';
import { revalidatePath } from 'next/cache';

export async function updateBasicIdentity(params: UpdateBasicIdentityParams) {
    try {
        const result = await OnboardingService.updateBasicIdentity(params);
        revalidatePath('/student/onboarding');
        return { success: true, result };
    } catch (error) {
        console.error('Error updating basic identity:', error);
        return { success: false, error: 'Failed to update basic identity' };
    }
}

export async function updateAcademicBackground(params: UpdateAcademicBackgroundParams) {
    try {
        const result = await OnboardingService.updateAcademicBackground(params);
        revalidatePath('/student/onboarding');
        return { success: true, result };
    } catch (error) {
        console.error('Error updating academic background:', error);
        return { success: false, error: 'Failed to update academic background' };
    }
}

export async function updateProfessionalExperience(params: UpdateProfessionalExperienceParams) {
    try {
        const result = await OnboardingService.updateProfessionalExperience(params);
        revalidatePath('/student/onboarding');
        return { success: true, result };
    } catch (error) {
        console.error('Error updating professional experience:', error);
        return { success: false, error: 'Failed to update professional experience' };
    }
}
