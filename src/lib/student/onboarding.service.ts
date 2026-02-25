import { createClient } from '@/lib/supabase/server';

export interface UpdateBasicIdentityParams {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
    userType?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface AcademicBackgroundCGPA {
    value: string;
    scale: number;
}

export interface UpdateAcademicBackgroundParams {
    highestEducationLevel: string;
    academicStatus: string;
    institution?: string;
    degreeType?: string;
    fieldOfStudy?: string;
    graduationYear?: number;
    cgpa?: AcademicBackgroundCGPA;
    certifications?: any[];
    relevantCoursework?: string[];
    // Persona specific additional
    previousIndustry?: string;
    previousRole?: string;
    previousExperienceYears?: number;
    targetIndustry?: string;
    switchReason?: string;
    careerGapYears?: number;
    lastRole?: string;
}

export interface Experience {
    id?: string;
    company: string;
    role: string;
    industry?: string;
    startDate: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
}

export interface UpdateProfessionalExperienceParams {
    totalYearsExperience?: number;
    experiences: Experience[];
}

export interface UpdateSkillsAndGoalsParams {
    skills: string[];
    softSkills: string[];
    careerInterests: string[];
    preferredLocations: string[];
    salaryExpectation?: string;
    availability: string;
    shortTermGoals?: string;
    longTermGoals?: string;
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
            // Also keep text cgpa for legacy if needed
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

    /**
     * Updates the professional experience.
     */
    static async updateProfessionalExperience(params: UpdateProfessionalExperienceParams) {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('Unauthorized');
        }

        // 1. Update total_years_experience in profiles
        if (params.totalYearsExperience !== undefined && !isNaN(params.totalYearsExperience)) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ total_years_experience: params.totalYearsExperience })
                .eq('id', user.id);

            if (profileError) {
                console.error('Error updating total years experience:', profileError);
                // We continue even if this fails, as it might just be the column missing for now
            }
        }

        // 2. Sync experiences list
        // Remove all current experiences to sync
        const { error: deleteError } = await supabase
            .from('candidate_experience')
            .delete()
            .eq('user_id', user.id);

        if (deleteError) {
            console.error('Error deleting old experiences:', deleteError);
            // If the table doesn't exist, this will fail. Let's provide a clearer error for the user.
            if (deleteError.code === '42P01') {
                throw new Error('Database table "candidate_experience" missing. Please run the migration.');
            }
            throw new Error('Failed to sync professional experience');
        }

        if (params.experiences && params.experiences.length > 0) {
            const experienceData = params.experiences.map((exp: Experience) => ({
                user_id: user.id,
                company: exp.company || 'Unknown Company',
                role: exp.role || 'Professional',
                industry: exp.industry || null,
                start_date: exp.startDate || new Date().toISOString().split('T')[0], // Fallback to now if missing
                end_date: exp.currentlyWorking ? null : (exp.endDate || null),
                currently_working: exp.currentlyWorking || false,
                description: exp.description || ''
            }));

            const { error: insertError } = await supabase
                .from('candidate_experience')
                .insert(experienceData);

            if (insertError) {
                console.error('Error inserting new experiences:', insertError);
                throw new Error('Failed to save professional experiences');
            }
        }

        return { success: true };
    /**
     * Updates skills and career goals.
     */
    static async updateSkillsAndGoals(params: UpdateSkillsAndGoalsParams) {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('Unauthorized');
        }

        // 1. Update Profile fields
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                skills: params.skills,
                soft_skills: params.softSkills,
                availability: params.availability,
                salary_expectation: params.salaryExpectation,
                short_term_goals: params.shortTermGoals,
                long_term_goals: params.longTermGoals
            })
            .eq('id', user.id);

        if (profileError) {
            console.error('Error updating skills and goals in profile:', profileError);
            throw new Error('Failed to update skills and goals profile');
        }

        // 2. Update Preferences
        const { error: prefError } = await supabase
            .from('candidate_preferences')
            .upsert({
                user_id: user.id,
                career_interests: params.careerInterests,
                preferred_locations: params.preferredLocations
            }, { onConflict: 'user_id' });

        if (prefError) {
            console.error('Error updating career preferences:', prefError);
            throw new Error('Failed to update career preferences');
        }

        return { success: true };
    }
}
