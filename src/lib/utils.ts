import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges Tailwind class names using clsx and tailwind-merge to resolve conflicts
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Formats a date string as a human-readable relative time string (e.g. '2 hours ago')
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
}

// Formats a date string to a short readable date (e.g. 'Feb 23, 2026')
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
// Checks if an email domain matches a website domain (supports subsets like mit.edu vs user@cs.mit.edu)
export function getDomainMatch(email: string, website: string): boolean {
    if (!email || !website) return false;

    const emailDomain = email.split('@')[1]?.toLowerCase().trim();
    let webDomain = website.toLowerCase().trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];

    if (!emailDomain || !webDomain) return false;

    // Check if one is a subset of the other (e.g. mit.edu and user@mit.edu)
    return emailDomain.includes(webDomain) || webDomain.includes(emailDomain);
}
