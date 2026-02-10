"use client"

import { ArrowRight } from "lucide-react"

export function RecommendedSimulations() {
    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-t border-border-color pt-8 dark:border-white/10">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">Recommended for You</h2>
                    <p className="text-sm text-text-secondary dark:text-gray-400">Based on your skills and interests</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark">
                    Explore Library
                    <ArrowRight className="size-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Recommendation 1 */}
                <div className="group cursor-pointer overflow-hidden rounded-xl border border-border-color bg-white transition-all hover:scale-[1.02] hover:shadow-md dark:bg-[#1e1429] dark:border-white/10">
                    <div className="h-28 bg-gray-200 relative">
                        <div className="absolute inset-0 bg-blue-500/20" />
                    </div>
                    <div className="p-3">
                        <span className="text-[9px] font-bold text-primary uppercase">Data Science</span>
                        <h4 className="mt-1 text-sm font-bold text-text-main dark:text-white line-clamp-1">Python for Finance</h4>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-text-secondary dark:text-gray-400">5 Modules</span>
                            <span className="text-[10px] font-bold text-green-600">+120 Points</span>
                        </div>
                    </div>
                </div>

                {/* Recommendation 2 */}
                <div className="group cursor-pointer overflow-hidden rounded-xl border border-border-color bg-white transition-all hover:scale-[1.02] hover:shadow-md dark:bg-[#1e1429] dark:border-white/10">
                    <div className="h-28 bg-gray-200 relative">
                        <div className="absolute inset-0 bg-purple-500/20" />
                    </div>
                    <div className="p-3">
                        <span className="text-[9px] font-bold text-primary uppercase">Software Eng</span>
                        <h4 className="mt-1 text-sm font-bold text-text-main dark:text-white line-clamp-1">Fullstack Web Sim</h4>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-text-secondary dark:text-gray-400">8 Modules</span>
                            <span className="text-[10px] font-bold text-green-600">+250 Points</span>
                        </div>
                    </div>
                </div>

                {/* Recommendation 3 */}
                <div className="group cursor-pointer overflow-hidden rounded-xl border border-border-color bg-white transition-all hover:scale-[1.02] hover:shadow-md dark:bg-[#1e1429] dark:border-white/10">
                    <div className="h-28 bg-gray-200 relative">
                        <div className="absolute inset-0 bg-pink-500/20" />
                    </div>
                    <div className="p-3">
                        <span className="text-[9px] font-bold text-primary uppercase">UI/UX Design</span>
                        <h4 className="mt-1 text-sm font-bold text-text-main dark:text-white line-clamp-1">Product Design Sprint</h4>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-text-secondary dark:text-gray-400">3 Modules</span>
                            <span className="text-[10px] font-bold text-green-600">+100 Points</span>
                        </div>
                    </div>
                </div>

                {/* Recommendation 4 */}
                <div className="group cursor-pointer overflow-hidden rounded-xl border border-border-color bg-white transition-all hover:scale-[1.02] hover:shadow-md dark:bg-[#1e1429] dark:border-white/10">
                    <div className="h-28 bg-gray-200 relative">
                        <div className="absolute inset-0 bg-emerald-500/20" />
                    </div>
                    <div className="p-3">
                        <span className="text-[9px] font-bold text-primary uppercase">Business</span>
                        <h4 className="mt-1 text-sm font-bold text-text-main dark:text-white line-clamp-1">Venture Capital Analyst</h4>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-text-secondary dark:text-gray-400">6 Modules</span>
                            <span className="text-[10px] font-bold text-green-600">+180 Points</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
