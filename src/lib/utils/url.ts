import { headers } from 'next/headers'

/**
 * Get the base URL for the application
 * Returns localhost in development, actual domain in production
 */
export async function getBaseUrl(): Promise<string> {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // Server-side: Get the host from request headers
    try {
        const headersList = await headers()
        const host = headersList.get('host')
        const protocol = headersList.get('x-forwarded-proto') || 'http'

        if (host) {
            return `${protocol}://${host}`
        }
    } catch (error) {
        // Headers not available, fall through to environment variables
    }

    // Fallback to environment variables
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // Final fallback to localhost for development
    return 'http://localhost:3000'
}

