
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EducatorReviewView from '@/components/admin/educators/review/EducatorReviewView'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Educator Application Review | Admin Portal',
    description: 'Detailed review and verification for educator access requests.',
}

export default async function EducatorApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') redirect('/dashboard')

    const { data: application, error } = await supabase
        .from('educator_applications')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !application) notFound()

    const adminProfile = {
        ...profile,
        email: user.email
    }

    return <EducatorReviewView profile={adminProfile} application={application} />
}

