/**
 * Get the base URL for the application
 * Returns localhost in development, Vercel URL in production
 */
export function getBaseUrl(): string {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // Server-side: check for Vercel environment variable
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // Server-side: check for custom domain
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    // Fallback to localhost for development
    return 'http://localhost:3000'
}
