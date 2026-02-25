'use client';

import React, { useState, useEffect } from 'react';
import OnboardingLayout from '@/components/student/onboarding/OnboardingLayout';
import ProgressStepper from '@/components/student/onboarding/ProgressStepper';
import PersonaSelection from '@/components/student/onboarding/PersonaSelection';
import AcademicBackground from '@/components/student/onboarding/AcademicBackground';
import { updateBasicIdentity, updateAcademicBackground } from '@/actions/student/onboarding.actions';
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

                    // Set initial academic data from profile fields (for professionals/switchers)
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
                console.log('Successfully saved academic data');
                // Move to Step 3 (not implemented yet)
            } else {
                console.error('Failed to save academic data:', result.error);
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
                    </>
                )}
            </div>

            {/* Footer Navigation Buttons (Only for Step 1 or generic if Step 2 doesn't have internal buttons) */}
            {/* Step 2 AcademicBackground currently doesn't have its own buttons, so we keep these */}
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
                        // If in Step 2, we need to make sure academicData is updated from the component.
                        // Currently, AcademicBackground in my implementation has its own local state.
                        // I should probably make it a controlled component or use a ref.
                        // For now, I'll update AcademicBackground to call onChange.
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
