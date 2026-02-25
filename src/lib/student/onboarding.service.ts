import { createClient } from '@/lib/supabase/server';

export interface UpdateBasicIdentityParams {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    userType: "University Student" | "Working Professional" | "Career Switcher" | "Returning Professional" | "Freelancer";
    dateOfBirth?: string;
    gender?: string;
}

export interface Certification {
    name: string;
    issuing_body?: string;
    year?: number;
}

export interface UpdateAcademicBackgroundParams {
    // Core Background (Everyone)
    highestEducationLevel: "High School" | "Diploma" | "Bachelor's" | "Master's" | "MBA" | "PhD" | "Other";
    fieldOfStudy: string;
    graduationYear?: number;
    certifications?: Certification[];

    // Student Specific
    institution?: string;
    degreeType?: string;
    cgpa?: {
        value: number;
        scale: 4 | 5 | 10;
    };
    academicStatus?: "Currently Studying" | "Graduated" | "On Break";
    relevantCoursework?: string[];

    // Career Switcher Specific
    previousIndustry?: string;
    previousRole?: string;
    previousExperienceYears?: number;
    targetIndustry?: string;
    switchReason?: string;

    // Returning Professional Specific
    careerGapYears?: number;
    lastRole?: string;
}

export class OnboardingService {
    /**
     * Updates the candidate's basic identity and persona.
     */
    static async updateBasicIdentity(params: UpdateBasicIdentityParams) {
        const supabase = await createClient();

        // Use getSession first as it's more resilient to intermittent auth server verification failures
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        let user: any = session?.user;
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
                user_type: params.userType,
                date_of_birth: params.dateOfBirth,
                gender: params.gender
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating basic identity:', error);
            throw new Error('Failed to update basic identity');
        }

        return { success: true, userType: params.userType };
    }

    /**
     * Updates the academic background and general profile background fields.
     */
    static async updateAcademicBackground(params: UpdateAcademicBackgroundParams) {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('Unauthorized');
        }

        // 1. Update Core Profile fields
        const profileUpdate: any = {
            highest_education_level: params.highestEducationLevel,
            academic_status: params.academicStatus
        };

        if (params.certifications) profileUpdate.certifications = params.certifications;
        if (params.previousIndustry) profileUpdate.previous_industry = params.previousIndustry;
        if (params.previousRole) profileUpdate.previous_role = params.previousRole;
        if (params.previousExperienceYears) profileUpdate.previous_experience_years = params.previousExperienceYears;
        if (params.switchReason) profileUpdate.switch_reason = params.switchReason;
        if (params.careerGapYears) profileUpdate.career_gap_years = params.careerGapYears;
        if (params.lastRole) profileUpdate.last_role = params.lastRole;

        const { error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdate)
            .eq('id', user.id);

        if (profileError) {
            console.error('Error updating profile background:', profileError);
            throw new Error('Failed to update profile background');
        }

        // 2. Update Education record
        const { data: existingEducation } = await supabase
            .from('candidate_education')
            .select('id')
            .eq('user_id', user.id)
            .single();

        const eduData: any = {
            institution: params.institution,
            degree_type: params.degreeType || params.highestEducationLevel,
            field_of_study: params.fieldOfStudy,
            graduation_year: params.graduationYear,
            academic_status: params.academicStatus,
            relevant_coursework: params.relevantCoursework
        };

        if (params.cgpa) {
            eduData.cgpa_value = params.cgpa.value;
            eduData.cgpa_scale = params.cgpa.scale;
            // Also keep text cgpa for legacy if needed, or just let users migration handle it
            eduData.cgpa = `${params.cgpa.value}/${params.cgpa.scale}`;
        }

        let error;
        if (existingEducation) {
            const { error: updateError } = await supabase
                .from('candidate_education')
                .update(eduData)
                .eq('id', existingEducation.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('candidate_education')
                .insert({ user_id: user.id, ...eduData });
            error = insertError;
        }

        if (error) {
            console.error('Error updating candidate_education:', error);
            throw new Error('Failed to update academic background');
        }

        // 3. Update target industry in preferences if applicable
        if (params.targetIndustry) {
            await supabase
                .from('candidate_preferences')
                .upsert({
                    user_id: user.id,
                    preferred_industries: [params.targetIndustry]
                }, { onConflict: 'user_id' });
        }

        return { success: true, data: params };
    }
}
