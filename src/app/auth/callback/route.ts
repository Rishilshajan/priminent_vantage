import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Default to student dashboard if next is not provided
    const rawNext = searchParams.get('next')
    const next = rawNext || null

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Fetch profile to determine dynamic redirect if 'next' is not specified
            const { data: { user } } = await supabase.auth.getUser()
            let redirectUrl = next

            if (user && !next) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                // Redirect based on role
                if (profile?.role === 'admin' || profile?.role === 'super_admin') {
                    redirectUrl = '/admin/dashboard'
                } else if (profile?.role === 'enterprise') {
                    redirectUrl = '/enterprise/dashboard'
                } else if (profile?.role === 'student') {
                    redirectUrl = '/student/dashboard'
                } else {
                    // Default fallback
                    redirectUrl = '/student/dashboard'
                }
            } else if (!next) {
                // If no user profile found and no next param, default to student dashboard
                redirectUrl = '/student/dashboard'
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
