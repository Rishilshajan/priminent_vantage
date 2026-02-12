
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EducatorSidebar } from '@/components/educator/EducatorSidebar'
import { EducatorApplicationForm } from '@/components/educator/EducatorApplicationForm'
import { EducatorApplyHeader } from '@/components/educator/apply/EducatorApplyHeader'
import { EducatorApplyFooter } from '@/components/educator/apply/EducatorApplyFooter'

export default async function EducatorApplyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/educators/login')
    }

    // Fetch profile for auto-filling
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display selection:bg-primary selection:text-white">
            <EducatorSidebar user={profile} />

            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-4xl mx-auto px-4 pb-12">
                    <EducatorApplyHeader />
                    <EducatorApplicationForm profile={profile} />
                </div>
                <EducatorApplyFooter />
            </main>
        </div>
    )
}
