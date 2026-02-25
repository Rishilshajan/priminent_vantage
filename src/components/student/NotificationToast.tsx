'use client'

import { useEffect } from 'react'
import { X, Bell, Sparkles } from 'lucide-react'

interface NotificationToastProps {
    notification: {
        id: string;
        title: string;
        content: string;
        type: string;
    };
    onDismiss: () => void;
    onClick: () => void;
    brandColor?: string;
}

export function NotificationToast({ notification, onDismiss, onClick, brandColor }: NotificationToastProps) {
    useEffect(() => {
        // Auto-dismiss after 8 seconds (longer for high-value student updates)
        const timer = setTimeout(() => {
            onDismiss()
        }, 8000)

        return () => clearTimeout(timer)
    }, [onDismiss])

    return (
        <div
            className="fixed top-20 right-4 z-[100] w-full max-w-sm cursor-pointer animate-in slide-in-from-right duration-500"
            onClick={onClick}
        >
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:border-white/10 dark:bg-[#1e1429]">
                {/* Accent bar */}
                <div className="h-1.5 w-full bg-primary" style={{ backgroundColor: brandColor }} />

                <div className="flex items-start gap-4 p-5">
                    <div className="flex-shrink-0">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary" style={{ backgroundColor: brandColor + '10', color: brandColor }}>
                            <Sparkles className="size-6" />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                            {notification.title}
                        </p>
                        <p className="mt-1 text-[13px] leading-snug text-slate-500 dark:text-slate-400">
                            {notification.content}
                        </p>
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary" style={{ color: brandColor }}>
                            Tap to view details
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDismiss()
                        }}
                        className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-white"
                    >
                        <X className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
