'use client';

import React, { useState, useEffect } from 'react';
import OnboardingLayout from '@/components/student/onboarding/OnboardingLayout';
import ProgressStepper from '@/components/student/onboarding/ProgressStepper';
import PersonaSelection from '@/components/student/onboarding/PersonaSelection';
import AcademicBackground from '@/components/student/onboarding/AcademicBackground';
import ProfessionalExperience from '@/components/student/onboarding/ProfessionalExperience';
import SkillsAndGoals from '@/components/student/onboarding/SkillsAndGoals';
import { updateBasicIdentity, updateAcademicBackground, updateProfessionalExperience, updateSkillsAndGoals } from '@/actions/student/onboarding.actions';
import { createClient } from '@/lib/supabase/client';

export interface BasicIdentityData {
    firstName: string;
    lastName: string;
    email: string; // read-only
    phoneNumber: string;
    country: string;
    state: string;
    city: string;
    userType: "University Student" | "Working Professional" | "Career Switcher" | "Returning Professional" | "Freelancer";
    dateOfBirth?: string;
    gender?: string;
}

export default function StudentOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [identityData, setIdentityData] = useState<BasicIdentityData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        state: '',
        city: '',
        userType: 'University Student',
        dateOfBirth: '',
        gender: ''
    });
    const [academicData, setAcademicData] = useState<any>(null);
    const [experienceData, setExperienceData] = useState<any>({
        totalYearsExperience: '',
        experiences: []
    });
    const [skillsData, setSkillsData] = useState<any>({
        skills: [],
        softSkills: [],
        careerInterests: [],
        preferredLocations: [],
        salaryExpectation: '',
        availability: 'Immediate',
        shortTermGoals: '',
        longTermGoals: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setIdentityData({
                        firstName: profile.first_name || '',
                        lastName: profile.last_name || '',
                        email: profile.email || user.email || '',
                        phoneNumber: profile.phone_number || '',
                        country: profile.country || '',
                        state: profile.state || '',
                        city: profile.city || '',
                        userType: (profile.user_type as any) || 'University Student',
                        dateOfBirth: profile.date_of_birth || '',
                        gender: profile.gender || ''
                    });

                    // Set initial academic data from profile fields
                    setAcademicData((prev: any) => ({
                        ...prev,
                        highestEducationLevel: profile.highest_education_level || '',
                        academicStatus: profile.academic_status || '',
                        certifications: profile.certifications || [],
                        previousIndustry: profile.previous_industry || '',
                        previousRole: profile.previous_role || '',
                        previousExperienceYears: profile.previous_experience_years || '',
                        switchReason: profile.switch_reason || '',
                        careerGapYears: profile.career_gap_years || '',
                        lastRole: profile.last_role || ''
                    }));

                    // Set experience data
                    setExperienceData((prev: any) => ({
                        ...prev,
                        totalYearsExperience: profile.total_years_experience || ''
                    }));

                    // Set skills data
                    setSkillsData((prev: any) => ({
                        ...prev,
                        skills: profile.skills || [],
                        softSkills: profile.soft_skills || [],
                        availability: profile.availability || 'Immediate',
                        salaryExpectation: profile.salary_expectation || '',
                        shortTermGoals: profile.short_term_goals || '',
                        longTermGoals: profile.long_term_goals || ''
                    }));
                } else if (user.email) {
                    setIdentityData(prev => ({ ...prev, email: user.email as string }));
                }

                // Fetch Education
                const { data: education } = await supabase
                    .from('candidate_education')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (education) {
                    setAcademicData((prev: any) => ({
                        ...prev,
                        institution: education.institution || '',
                        degreeType: education.degree_type || '',
                        fieldOfStudy: education.field_of_study || '',
                        graduationYear: education.graduation_year || '',
                        cgpa: education.cgpa_value ? { value: education.cgpa_value, scale: education.cgpa_scale || 4 } : null,
                        academicStatus: education.academic_status || prev?.academicStatus || '',
                        relevantCoursework: education.relevant_coursework || []
                    }));
                }

                // Fetch Professional Experience history
                const { data: experiences } = await supabase
                    .from('candidate_experience')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('start_date', { ascending: false });

                if (experiences && experiences.length > 0) {
                    setExperienceData((prev: any) => ({
                        ...prev,
                        experiences: experiences.map(exp => ({
                            id: exp.id,
                            company: exp.company,
                            role: exp.role,
                            industry: exp.industry,
                            startDate: exp.start_date,
                            endDate: exp.end_date || '',
                            currentlyWorking: exp.currently_working,
                            description: exp.description
                        }))
                    }));
                }

                // Fetch Preferences for Step 4
                const { data: preferences } = await supabase
                    .from('candidate_preferences')
                    .select('career_interests, preferred_locations')
                    .eq('user_id', user.id)
                    .single();

                if (preferences) {
                    setSkillsData((prev: any) => ({
                        ...prev,
                        careerInterests: preferences.career_interests || [],
                        preferredLocations: preferences.preferred_locations || []
                    }));
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleNextStep = async () => {
        setIsSubmitting(true);

        if (currentStep === 1) {
            // Save Basic Identity
            const result = await updateBasicIdentity({
                firstName: identityData.firstName,
                lastName: identityData.lastName,
                phoneNumber: identityData.phoneNumber,
                country: identityData.country,
                state: identityData.state,
                city: identityData.city,
                userType: identityData.userType,
                dateOfBirth: identityData.dateOfBirth,
                gender: identityData.gender
            });

            if (result.success) {
                setCurrentStep(2);
            } else {
                console.error('Failed to save identity data:', result.error);
            }
        } else if (currentStep === 2) {
            // Save Academic/Background info
            const result = await updateAcademicBackground(academicData);
            if (result.success) {
                setCurrentStep(3);
            } else {
                console.error('Failed to save academic data:', result.error);
            }
        } else if (currentStep === 3) {
            // Save Professional Experience
            const result = await updateProfessionalExperience({
                totalYearsExperience: Number(experienceData.totalYearsExperience),
                experiences: experienceData.experiences
            });
            if (result.success) {
                setCurrentStep(4);
            } else {
                console.error('Failed to save experience data:', result.error);
            }
        } else if (currentStep === 4) {
            // Save Skills and Goals
            const result = await updateSkillsAndGoals(skillsData);
            if (result.success) {
                setCurrentStep(5);
            } else {
                console.error('Failed to save skills data:', result.error);
            }
        }

        setIsSubmitting(false);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progressPercentage = (currentStep - 1) * 20;

    return (
        <OnboardingLayout
            stepper={<ProgressStepper currentStep={currentStep} progressPercentage={progressPercentage} />}
        >
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7f13ec]/20 border-t-[#7f13ec]"></div>
                    </div>
                ) : (
                    <>
                        {currentStep === 1 && (
                            <PersonaSelection
                                data={identityData}
                                onChange={(data) => setIdentityData(data)}
                            />
                        )}

                        {currentStep === 2 && (
                            <AcademicBackground
                                persona={identityData.userType}
                                initialData={academicData}
                                onBack={handleBack}
                                onChange={(data) => setAcademicData(data)}
                                onNext={(data) => {
                                    setAcademicData(data);
                                    handleNextStep();
                                }}
                            />
                        )}

                        {currentStep === 3 && (
                            <ProfessionalExperience
                                initialData={experienceData}
                                onBack={handleBack}
                                onChange={(data) => setExperienceData(data)}
                                onNext={(data) => {
                                    setExperienceData(data);
                                    handleNextStep();
                                }}
                            />
                        )}

                        {currentStep === 4 && (
                            <SkillsAndGoals
                                initialData={skillsData}
                                onBack={handleBack}
                                onChange={(data) => setSkillsData(data)}
                                onNext={(data) => {
                                    setSkillsData(data);
                                    handleNextStep();
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="mt-12 flex justify-between pt-10 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex h-12 items-center justify-center rounded-2xl border-2 border-slate-200/80 px-8 text-[12px] font-black uppercase tracking-widest text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-30"
                >
                    Back
                </button>
                <button
                    onClick={() => {
                        handleNextStep();
                    }}
                    disabled={isLoading || isSubmitting || !identityData.userType}
                    className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#7f13ec] to-[#a344ff] px-10 text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#7f13ec]/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#7f13ec]/40 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isSubmitting ? 'Saving...' : 'Next Step'}
                    {!isSubmitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
            </div>
        </OnboardingLayout>
    );
}
