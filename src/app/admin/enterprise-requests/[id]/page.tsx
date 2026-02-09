import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RequestDetailsView from '@/components/admin/enterprise-requests/RequestDetailsView'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Enterprise Request Review | Admin Portal',
    description: 'Detailed review and verification for enterprise access requests.',
}

interface PageProps {
    params: {
        id: string
    }
}

export default async function EnterpriseRequestDetailPage({ params }: PageProps) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Check for Admin Role
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        const adminProfile = {
            ...profile,
            email: user.email
        }

        // Fetch the enterprise request data
        const { id } = await params
        const { data: requestData, error } = await supabase
            .from('enterprise_requests')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !requestData) {
            console.error('Error fetching enterprise request:', error)
            // Redirect or show 404 if request not found
            return redirect('/admin/dashboard')
        }

        return <RequestDetailsView profile={adminProfile} requestData={requestData} />
    }

    // If not admin, redirect back to main dashboard
    return redirect('/dashboard')
}
