"use client"

import { Palette } from "lucide-react"

interface BrandVisualsProps {
    brandColor?: string;
    footerText?: string;
    onBrandColorChange: (color: string) => void;
    onFooterTextChange: (text: string) => void;
}

export default function BrandVisuals({
    brandColor = "#7F13EC",
    footerText = "© 2024 Priminent Vantage. Confidentially Transmitted.",
    onBrandColorChange,
    onFooterTextChange
}: BrandVisualsProps) {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20 rounded-t-xl">
                <Palette className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Brand Visuals</h2>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Default Brand Color</label>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <input
                                    className="h-11 w-20 rounded-lg border-2 border-slate-300 dark:border-slate-600 p-1 cursor-pointer bg-white dark:bg-slate-900 relative z-20"
                                    type="color"
                                    value={brandColor}
                                    onChange={(e) => onBrandColorChange(e.target.value)}
                                />
                            </div>
                            <input
                                className="flex-1 h-11 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono uppercase outline-none transition-colors"
                                type="text"
                                value={brandColor}
                                onChange={(e) => onBrandColorChange(e.target.value)}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Primary action color for simulations and UI.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Default Footer Text</label>
                        <input
                            className="w-full h-11 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                            placeholder="e.g. © 2024 Priminent Vantage Corp. All Rights Reserved."
                            type="text"
                            value={footerText || ""}
                            onChange={(e) => onFooterTextChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
