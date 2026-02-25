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
            "flex w-full flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-100 bg-white p-12 text-center dark:border-white/5 dark:bg-[#1e1429]/50",
            className
        )}>
            <div className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-slate-50 dark:bg-white/5">
                <Icon className="size-12 text-slate-300 dark:text-slate-700" />
            </div>

            <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="mb-8 max-w-sm text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
            </p>

            {ctaLabel && ctaHref && (
                <Link
                    href={ctaHref}
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-[13px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.05] hover:bg-primary active:scale-95 dark:bg-white/10 dark:hover:bg-primary"
                    style={brandColorStyle}
                >
                    <span>{ctaLabel}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    )
}
