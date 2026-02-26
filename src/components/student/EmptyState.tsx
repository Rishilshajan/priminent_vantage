"use client"

import React from "react"
import Link from "next/link"
import { LucideIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    ctaLabel?: string;
    ctaHref?: string;
    brandColor?: string;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    ctaLabel,
    ctaHref,
    brandColor,
    className
}: EmptyStateProps) {
    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};
    const brandColorBorder = brandColor ? { borderColor: brandColor } : {};
    const brandColorText = brandColor ? { color: brandColor } : {};

    return (
        <div className={cn(
            "flex w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-100 bg-white p-8 text-center dark:border-white/5 dark:bg-[#1e1429]/50 lg:rounded-[40px] lg:p-12",
            className
        )}>
            <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-white/5 lg:mb-6 lg:size-24">
                <Icon className="size-10 text-slate-300 dark:text-slate-700 lg:size-12" />
            </div>

            <h3 className="mb-2 text-xl font-black    text-slate-900 dark:text-white lg:mb-3 lg:text-2xl">
                {title}
            </h3>

            <p className="mb-6 max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 lg:mb-8 lg:text-base">
                {description}
            </p>

            {ctaLabel && ctaHref && (
                <Link
                    href={ctaHref}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.05] hover:bg-primary active:scale-95 dark:bg-white/10 dark:hover:bg-primary lg:gap-3 lg:rounded-2xl lg:px-8 lg:py-4 lg:text-[13px]"
                    style={brandColorStyle}
                >
                    <span>{ctaLabel}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    )
}
