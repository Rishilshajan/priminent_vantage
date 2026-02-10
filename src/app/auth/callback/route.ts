import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Default to enterprise dashboard if next is not provided or was the old employee route
    const rawNext = searchParams.get('next')
    const next = (rawNext === '/employee' || !rawNext) ? '/enterprise/dashboard' : rawNext

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Fetch profile to determine dynamic redirect if 'next' is not specified or is default
            const { data: { user } } = await supabase.auth.getUser()
            let redirectUrl = next

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role === 'admin' || profile?.role === 'super_admin') {
                    redirectUrl = '/admin/dashboard'
                }
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
