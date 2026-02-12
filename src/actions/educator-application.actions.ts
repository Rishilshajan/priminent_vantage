"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitEducatorApplication(formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: "You must be logged in to apply." };
        }

        // Extract form data
        const fullName = formData.get("fullName") as string;
        const institutionalEmail = formData.get("institutionalEmail") as string;
        const institutionName = formData.get("institutionName") as string;
        const institutionWebsite = formData.get("institutionWebsite") as string;
        const department = formData.get("department") as string;
        const designation = formData.get("designation") as string;
        const designationOther = formData.get("designationOther") as string;
        const coursesTeaching = formData.get("coursesTeaching") as string;
        const academicLevel = formData.get("academicLevel") as string;
        const academicLevelOther = formData.get("academicLevelOther") as string;
        const estimatedStudents = formData.get("estimatedStudents") as string;
        const intendedUsage = formData.get("intendedUsage") as string;
        const implementationTypes = formData.getAll("implementationTypes") as string[];
        const linkedinProfile = formData.get("linkedinProfile") as string;
        const verificationDocument = formData.get("verificationDocument") as File | null;

        // Handle verification document upload
        let verificationDocumentUrl = null;
        if (verificationDocument && verificationDocument.size > 0) {
            const fileExt = verificationDocument.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `verification-docs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('educator-verification')
                .upload(filePath, verificationDocument);

            if (uploadError) {
                console.error("Upload error:", uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('educator-verification')
                    .getPublicUrl(filePath);
                verificationDocumentUrl = publicUrl;
            }
        }

        // Insert into database
        const { error: insertError } = await supabase
            .from('educator_applications')
            .insert({
                user_id: user.id,
                full_name: fullName,
                institutional_email: institutionalEmail,
                institution_name: institutionName,
                institution_website: institutionWebsite,
                department: department,
                designation: designation === "Other" ? designationOther : designation,
                courses_teaching: coursesTeaching,
                academic_level: academicLevel === "Other" ? academicLevelOther : academicLevel,
                estimated_students: estimatedStudents,
                intended_usage: intendedUsage,
                implementation_types: implementationTypes,
                linkedin_profile: linkedinProfile,
                verification_document_url: verificationDocumentUrl,
                status: 'PENDING_VERIFICATION'
            });

        if (insertError) {
            console.error("Insert error:", insertError);
            return { success: false, error: "Failed to submit application. Please try again." };
        }

        revalidatePath('/educators/dashboard');
        revalidatePath('/educators/apply');

        return { success: true };

    } catch (error) {
        console.error("Error submitting application:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
