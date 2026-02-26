"use client"

import { Star, Quote } from "lucide-react"

interface Review {
    id: string;
    student_name: string;
    student_role: string;
    rating: number;
    content: string;
    avatar_url?: string;
}

interface SimulationReviewsProps {
    reviews?: Review[];
    orgBranding?: any;
}

export function SimulationReviews({ reviews = [], orgBranding }: SimulationReviewsProps) {
    const brandColorText = orgBranding?.brand_color ? { color: orgBranding.brand_color } : {};

    // Use real reviews if available, otherwise fallback to featured mock testimonials
    const displayReviews = reviews && reviews.length > 0 ? reviews : [
        {
            id: '1',
            student_name: 'Marcus T.',
            student_role: 'Junior SRE at Nexora',
            rating: 5,
            content: "This simulation helped me land my first Cloud Engineering role by giving me something concrete to discuss during my technical interview. The tasks were incredibly realistic.",
            avatar_url: 'https://i.pravatar.cc/150?u=121'
        },
        {
            id: '2',
            student_name: 'Elena R.',
            student_role: 'Cloud Architect Intern',
            rating: 5,
            content: "The level of detail in the project briefs is outstanding. I learned more about Terraform in 6 hours here than in my entire university course.",
            avatar_url: 'https://i.pravatar.cc/150?u=122'
        }
    ];

    return (
        <section id="reviews" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-10">
                <div className="h-0.5 w-8 bg-primary rounded-full" style={orgBranding?.brand_color ? { backgroundColor: orgBranding.brand_color } : {}} />
                <h2 className="font-display text-3xl font-black    text-slate-900 dark:text-white">Student Reviews</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {displayReviews.map((review) => {
                    const reviewerInitials = review.student_name
                        ? review.student_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                        : "S";

                    return (
                        <div key={review.id} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`size-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>

                            <div className="relative mb-8">
                                <Quote className="absolute -left-2 -top-4 size-10 text-primary/5 -z-10" style={orgBranding?.brand_color ? { color: `${orgBranding.brand_color}0d` } : {}} />
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                                    "{review.content}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {review.avatar_url ? (
                                    <img
                                        src={review.avatar_url}
                                        alt={review.student_name}
                                        className="size-12 rounded-full border-2 border-slate-100 dark:border-white/10 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20"
                                        style={orgBranding?.brand_color ? { color: orgBranding.brand_color, backgroundColor: `${orgBranding.brand_color}1a`, borderColor: `${orgBranding.brand_color}33` } : {}}
                                    >
                                        {reviewerInitials}
                                    </div>
                                )}
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white text-sm">{review.student_name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{review.student_role}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing featured student highlights
                </p>
            )}
        </section>
    );
}
