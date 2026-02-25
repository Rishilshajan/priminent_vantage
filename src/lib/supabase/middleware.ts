import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // Fetch user profile to determine role-based redirect and onboarding status
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, onboarding_completed')
            .eq('id', user.id)
            .single()

        const url = request.nextUrl.clone()
        const pathname = request.nextUrl.pathname

        // 1. Role-based Redirect from Root
        if (pathname === '/') {
            if (profile?.role === 'admin' || profile?.role === 'super_admin') {
                url.pathname = '/admin/dashboard'
            } else if (profile?.role === 'enterprise') {
                url.pathname = '/enterprise/dashboard'
            } else if (profile?.role === 'student') {
                url.pathname = profile.onboarding_completed ? '/student/dashboard' : '/student/onboarding'
            } else if (profile?.role === 'educator') {
                url.pathname = '/educators/dashboard'
            } else {
                url.pathname = '/student/dashboard'
            }
            return NextResponse.redirect(url)
        }

        // 2. Student Onboarding Enforcer
        if (profile?.role === 'student') {
            const isOnboardingPath = pathname.startsWith('/student/onboarding')
            const isDashboardPath = pathname.startsWith('/student/dashboard')

            if (!profile.onboarding_completed && isDashboardPath) {
                url.pathname = '/student/onboarding'
                return NextResponse.redirect(url)
            }

            if (profile.onboarding_completed && isOnboardingPath) {
                url.pathname = '/student/dashboard'
                return NextResponse.redirect(url)
            }
        }
    }

    // Role-based protection could go here if we wanted to enforce /enterprise routes only for enterprise users
    // For now, let's keep it simple: /dashboard is shared but content varies, or we redirect.

    return supabaseResponse
}
