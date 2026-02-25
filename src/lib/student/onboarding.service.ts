import { createClient } from '@/lib/supabase/server';

export interface UpdateBasicIdentityParams {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    userType: string;
}

export interface UpdateAcademicBackgroundParams {
    university: string;
    degreeLevel: string;
    fieldOfStudy: string;
    graduationYear: number;
    gpa?: string;
}

export class OnboardingService {
    /**
     * Updates the candidate's basic identity and persona.
     */
    static async updateBasicIdentity(params: UpdateBasicIdentityParams) {
        const supabase = await createClient();

        // Use getSession first as it's more resilient to intermittent auth server verification failures
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        let user = session?.user;
        let authError = sessionError;

        if (!user) {
            // Fallback to getUser which is more strict
            const { data: { user: verifiedUser }, error: userError } = await supabase.auth.getUser();
            user = verifiedUser;
            authError = userError || authError;
        }

        if (!user) {
            console.error('OnboardingService.updateBasicIdentity: Auth failed', {
                sessionError: sessionError?.message,
                authError: authError?.message,
                hasSession: !!session
            });
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: params.firstName,
                last_name: params.lastName,
                phone_number: params.phoneNumber,
                country: params.country,
                state: params.state,
                city: params.city,
                user_type: params.userType
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating basic identity:', error);
            throw new Error('Failed to update basic identity');
        }

        return { success: true, userType: params.userType };
    }

    /**
     * Updates the academic background.
     */
    static async updateAcademicBackground(params: UpdateAcademicBackgroundParams) {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('Unauthorized');
        }

        // Check if an education record already exists for the user
        const { data: existingEducation } = await supabase
            .from('candidate_education')
            .select('id')
            .eq('user_id', user.id)
            .single();

        let error;

        if (existingEducation) {
            // Update existing
            const { error: updateError } = await supabase
                .from('candidate_education')
                .update({
                    institution: params.university,
                    degree_type: params.degreeLevel,
                    field_of_study: params.fieldOfStudy,
                    graduation_year: params.graduationYear,
                    cgpa: params.gpa
                })
                .eq('id', existingEducation.id);
            error = updateError;
        } else {
            // Insert new
            const { error: insertError } = await supabase
                .from('candidate_education')
                .insert({
                    user_id: user.id,
                    institution: params.university,
                    degree_type: params.degreeLevel,
                    field_of_study: params.fieldOfStudy,
                    graduation_year: params.graduationYear,
                    cgpa: params.gpa
                });
            error = insertError;
        }

        if (error) {
            console.error('Error updating candidate_education:', error);
            throw new Error('Failed to update academic background');
        }

        return { success: true, data: params };
    }
}
