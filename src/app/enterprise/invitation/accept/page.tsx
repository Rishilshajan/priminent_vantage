import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AcceptInvitationView } from '@/components/enterprise/invitation/AcceptInvitationView';

interface PageProps {
    searchParams: Promise<{ token?: string }>;
}

/**
 * Server Component for the invitation acceptance page.
 * Unwraps searchParams and passes the token to the client view.
 */
export default async function AcceptInvitationPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const token = params.token || null;

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-center">
                <div className="space-y-4">
                    <Loader2 className="size-10 animate-spin text-primary mx-auto" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warming up...</p>
                </div>
            </div>
        }>
            <AcceptInvitationView token={token} />
        </Suspense>
    );
}
