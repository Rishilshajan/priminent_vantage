'use server'

import { createClient } from "@/lib/supabase/server";
import { candidateService } from "@/lib/candidate/candidate.service";
import { uploadToS3 } from "@/lib/s3";

export async function getSkillsAndCertificationsAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await candidateService.getSkillsAndCertifications(user.id);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch skills and certifications" };
    }
}

export async function getStudentFullProfileAction() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const data = await candidateService.getStudentFullProfile(user.id);
        return { success: true as const, data };
    } catch (error: any) {
        return { success: false as const, error: error.message || "Failed to fetch full student profile" };
    }
}

export async function uploadProfileImageAction(formData: FormData) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const file = formData.get('file') as File;
        if (!file) return { success: false as const, error: "No file provided" };

        // 1. Get profile to find org_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('org_id')
            .eq('id', user.id)
            .single();

        const orgId = profile?.org_id || 'system';
        const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;

        // 2. Upload to S3
        const { url } = await uploadToS3({
            file,
            fileName,
            folder: 'avatars',
            orgId: orgId
        });

        // 3. Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: url })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return { success: true as const, url };
    } catch (error: any) {
        console.error("Error uploading profile image:", error);
        return { success: false as const, error: error.message || "Failed to upload profile image" };
    }
}

export async function updateStudentProfileAction(params: {
    first_name?: string;
    last_name?: string;
    highest_education_level?: string;
    phone_number?: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    city?: string;
    country?: string;
}) {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false as const, error: "Unauthorized" };

        const { error } = await supabase
            .from('profiles')
            .update({
                ...params,
                // Ensure field names match database schema
                // (Note: some might need mapping if frontend uses different keys)
            })
            .eq('id', user.id);

        if (error) throw error;

        return { success: true as const };
    } catch (error: any) {
        console.error("Error updating student profile:", error);
        return { success: false as const, error: error.message || "Failed to update profile" };
    }
}
