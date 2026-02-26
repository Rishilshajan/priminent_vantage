import Link from "next/link";
import { CheckCircle, Check, MoreHorizontal, ArrowRight, LifeBuoy } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function ConfirmationPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col font-poppins text-foreground selection:bg-primary selection:text-white">
            <AuthHeader />

            <main className="flex-grow layout-container flex flex-col items-center">
                <div className="w-full px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-10">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        {/* Confirmation Hero */}
                        <div className="flex flex-col gap-10 px-4 py-6 animate-fade-in-up">
                            <div className="flex flex-col gap-8 items-start">
                                {/* Status Icon */}
                                <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                                    <CheckCircle className="size-10" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-foreground    text-[32px] font-black leading-tight md:text-5xl max-w-[720px]">
                                        Request Received
                                    </h1>
                                    <p className="text-muted-foreground text-base md:text-lg font-normal leading-relaxed max-w-[720px]">
                                        Thank you for your interest in Priminent Vantage! Your request for enterprise access has been successfully submitted. Our team is currently reviewing your application to ensure we provide the best onboarding experience tailored to your organization's needs.
                                    </p>
                                </div>
                                <Link href="/" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-primary-foreground text-base font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-[1.02]">
                                    <span className="truncate">Return to Homepage</span>
                                </Link>
                            </div>

                            {/* Steps Visualization */}
                            <div className="mt-8 animate-fade-in-up delay-200">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">What happens next</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Step 1 */}
                                    <div className="flex flex-col gap-4 p-4 rounded-xl border border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/50">
                                        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJQjRH_ryr230Sp4UNKvD9seQp1Fap36ANaQFKD9zjAYQ_twE2AD_h9Xxj6cAsIjKv2C9srwJbXvbyifX1VNPQnrNPUDc-4LYJaN1ZzXrG442lvocf7V2U9EpJp_GQc1Sdeo5FYRC-oh3HYdB4c1VrYtkIF74aRjiZ60Hf5rDNy86U3mdnZqdASrISP0pE9SLyMUpSPXnPrsZiIYX94M4ij9sv0azRzNgkvLnoxfWRpb6bwn83pdLxWzxpvDFJvWw-ZIqyt-N7OHs")' }}>
                                            <div className="absolute inset-0 bg-green-500/10 mix-blend-multiply"></div>
                                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                                <Check className="size-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</span>
                                            </div>
                                            <p className="text-foreground text-base font-bold leading-normal">Submission Received</p>
                                            <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">We have securely received your company details and requirements.</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex flex-col gap-4 p-4 rounded-xl border border-primary/20 bg-card shadow-sm">
                                        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCk2j0Uyqte2KPAmZNFOHKFw4KeTskxx3wDhhEYEZTO2L6mE9HZLRI3y6-Jr7CMU1nOjEZobS4ZDeFXVPZZBt7RhbBHIe3rdyAx6JcdDCC3cLOk5w315hJ1Gw9aMr8QfC55iBtMZiVeJLHiYrlulS4xIWS10m6I-EwNYVpm2ckU7QCp0bCHaNIWRZZxk2zg-aSUvbhcG2J6C3MzEvz2SibxsI7_KAEYtY0jWnQYN-akm3Qru2lCZZ_FFiOKlEYZbySto3ykRYbjhJA")' }}>
                                            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                                            <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-sm animate-pulse">
                                                <MoreHorizontal className="size-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300">In Progress</span>
                                            </div>
                                            <p className="text-foreground text-base font-bold leading-normal">Team Review</p>
                                            <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">Our enterprise specialists are analyzing your specific needs.</p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-muted/30 opacity-75">
                                        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden grayscale relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGEXHHfgUYielnS8zuhuf8QyykvUjqEelfacq3pzubYeDVlisgYzsCOHYojyiInLzH96olJm9AXI9tKsXX8cRuCmgNZ5hSiP_kOQTJOC9_ZcFVJdv_-1QpIlRA-PIYHRsB7yXQ6bxXRIc_sUhGVra8rOqPEQb7XL3KdnvRud_p0VZN3XmROcur_RwJwsCxRKkRkvj-d9qjJq1c8OszO-gSXrjHJf9nDPh_bZfIbwHmvJ36dus5B0VXT-aK7jngfWqYKGKeo2DRUoo")' }}>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>
                                            </div>
                                            <p className="text-foreground text-base font-bold leading-normal">Personal Outreach</p>
                                            <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">Expect an email within 1-2 business days to set up next steps.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/10 p-6 md:p-8 mt-8 animate-fade-in-up delay-400">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-primary dark:text-purple-300 mb-1">
                                        <LifeBuoy className="size-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Support</span>
                                    </div>
                                    <h3 className="text-foreground text-lg font-bold leading-tight">Need immediate assistance?</h3>
                                    <p className="text-muted-foreground text-base font-normal leading-normal max-w-lg">
                                        If you have urgent questions about the enterprise onboarding process or need to modify your request, please reach out directly.
                                    </p>
                                </div>
                                <a className="group flex items-center gap-2 text-sm font-bold text-primary dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 transition-colors whitespace-nowrap" href="#">
                                    Contact Enterprise Support
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
