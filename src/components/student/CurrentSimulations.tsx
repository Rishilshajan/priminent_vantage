"use client"

import Link from "next/link"

export function CurrentSimulations() {
    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-main dark:text-white">Current Simulations</h2>
                <Link href="#" className="text-sm font-medium text-primary hover:underline dark:text-primary-light">
                    View all
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Simulation Card 1 */}
                <div className="group relative flex overflow-hidden rounded-2xl border border-border-color bg-white transition-all hover:border-primary/40 hover:shadow-lg dark:bg-[#1e1429] dark:border-white/10">
                    <div className="w-1/3 min-w-[140px] bg-gray-100 dark:bg-gray-800 relative">
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-90 transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">Global Tech Corp</span>
                            </div>
                        </div>
                        <h3 className="mb-1 text-lg font-bold leading-tight text-text-main dark:text-white group-hover:text-primary transition-colors">Cybersecurity Analyst</h3>
                        <p className="mb-4 text-xs text-text-secondary dark:text-gray-400 line-clamp-1">Module 3: Intrusion Detection & Response</p>
                        <div className="mt-auto flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-text-main dark:text-white">65% Progress</span>
                                <span className="text-text-secondary dark:text-gray-400">8 days left</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                <div className="h-full rounded-full bg-primary" style={{ width: "65%" }}></div>
                            </div>
                            <button className="mt-2 w-full rounded-lg bg-primary py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Continue</button>
                        </div>
                    </div>
                </div>

                {/* Simulation Card 2 */}
                <div className="group relative flex overflow-hidden rounded-2xl border border-border-color bg-white transition-all hover:border-primary/40 hover:shadow-lg dark:bg-[#1e1429] dark:border-white/10">
                    <div className="w-1/3 min-w-[140px] bg-gray-100 dark:bg-gray-800 relative">
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 opacity-90 transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400">Marketing Lab</span>
                            </div>
                        </div>
                        <h3 className="mb-1 text-lg font-bold leading-tight text-text-main dark:text-white group-hover:text-primary transition-colors">Digital Strategy Pro</h3>
                        <p className="mb-4 text-xs text-text-secondary dark:text-gray-400 line-clamp-1">Module 1: Audience Segmentation</p>
                        <div className="mt-auto flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-text-main dark:text-white">12% Progress</span>
                                <span className="text-text-secondary dark:text-gray-400">14 days left</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                <div className="h-full rounded-full bg-yellow-500" style={{ width: "12%" }}></div>
                            </div>
                            <button className="mt-2 w-full rounded-lg bg-primary py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Resume</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
