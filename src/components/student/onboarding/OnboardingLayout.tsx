'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    stepper?: React.ReactNode;
}

export default function OnboardingLayout({ children, sidebar, stepper }: OnboardingLayoutProps) {
    const [initials, setInitials] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const first = profile.first_name ? profile.first_name.charAt(0).toUpperCase() : '';
                    const last = profile.last_name ? profile.last_name.charAt(0).toUpperCase() : '';
                    setInitials(`${first}${last}`);
                }
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="layout-container flex min-h-screen grow flex-col bg-[#f7f6f8] text-slate-900 font-display dark:bg-[#191022] dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#7f13ec]/10 bg-white/90 px-6 py-4 backdrop-blur-md dark:bg-[#191022]/80 lg:px-20">
                <div className="flex items-center gap-3">
                    <div className="text-[#7f13ec]">
                        <span className="material-symbols-outlined text-4xl">star</span>
                    </div>
                    <h2 className="text-xl font-bold   ">Priminent Vantage</h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-lg bg-[#7f13ec]/5 p-2 text-slate-600 transition-colors hover:bg-[#7f13ec]/10 dark:text-slate-300">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#7f13ec]/10 bg-[#7f13ec]/10 font-bold tracking-widest text-[#7f13ec] shadow-sm">
                        {initials ? initials : <span className="material-symbols-outlined text-lg">person</span>}
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 lg:px-20">
                {stepper && (
                    <div className="mb-10 w-full">
                        {stepper}
                    </div>
                )}

                {/* Full Width Main Content Area */}
                <div className="w-full space-y-10">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#7f13ec]/5 px-6 py-10 text-sm text-slate-400 md:flex-row lg:px-20">
                <p>© 2024 Prominent Vantage Executive Search. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="transition-colors hover:text-[#7f13ec]">Privacy Policy</Link>
                    <Link href="#" className="transition-colors hover:text-[#7f13ec]">Terms of Service</Link>
                    <Link href="#" className="transition-colors hover:text-[#7f13ec]">Help Center</Link>
                </div>
            </footer>
        </div>
    );
}
