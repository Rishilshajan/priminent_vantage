'use client';

import React, { useState, useEffect } from 'react';
import OnboardingLayout from '@/components/student/onboarding/OnboardingLayout';
import ProgressStepper from '@/components/student/onboarding/ProgressStepper';
import PersonaSelection from '@/components/student/onboarding/PersonaSelection';
import { updateBasicIdentity } from '@/actions/student/onboarding.actions';
import { createClient } from '@/lib/supabase/client';

export interface BasicIdentityData {
    firstName: string;
    lastName: string;
    email: string; // read-only
    phoneNumber: string;
    country: string;
    state: string;
    city: string;
    userType: string;
}

export default function StudentOnboardingPage() {
    const [identityData, setIdentityData] = useState<BasicIdentityData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        state: '',
        city: '',
        userType: 'University Student'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
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
                        userType: profile.user_type || 'University Student'
                    });
                } else if (user.email) {
                    setIdentityData(prev => ({ ...prev, email: user.email as string }));
                }
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    const handleNextStep = async () => {
        if (!identityData.userType) return;

        setIsSubmitting(true);
        // Save Basic Identity to the database via server action
        const result = await updateBasicIdentity({
            firstName: identityData.firstName,
            lastName: identityData.lastName,
            phoneNumber: identityData.phoneNumber,
            country: identityData.country,
            state: identityData.state,
            city: identityData.city,
            userType: identityData.userType,
        });
        setIsSubmitting(false);

        if (result.success) {
            console.log('Successfully saved identity data');
            // Move to Step 2
        } else {
            console.error('Failed to save identity data:', result.error);
        }
    };

    return (
        <OnboardingLayout
            stepper={<ProgressStepper />}
        >
            {/* Step 1: Persona Selection / Basic Identity */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7f13ec]/20 border-t-[#7f13ec]"></div>
                </div>
            ) : (
                <PersonaSelection
                    data={identityData}
                    onChange={(data) => setIdentityData(data)}
                />
            )}

            {/* Footer Navigation Buttons */}
            <div className="mt-12 flex justify-between pt-10 border-t border-slate-200/60 dark:border-slate-800/60">
                <button className="flex h-12 items-center justify-center rounded-2xl border-2 border-slate-200/80 px-8 text-[12px] font-black uppercase tracking-widest text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                    Back
                </button>
                <button
                    onClick={handleNextStep}
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
