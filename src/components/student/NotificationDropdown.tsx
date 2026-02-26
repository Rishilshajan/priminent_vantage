'use client'

import React, { useEffect, useState } from 'react'
import { Popover } from '@/components/ui/Popover'
import { Bell, Rocket, Clock, ChevronRight, Inbox, Sparkles } from 'lucide-react'
import { fetchStudentNotificationsAction, fetchStudentNotificationsCountAction } from '@/actions/student/notification.actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NotificationDropdown({ brandColor }: { brandColor?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};
    const brandColorText = brandColor ? { color: brandColor } : {};

    const loadData = async () => {
        setLoading(true)
        try {
            const [notifRes, countRes] = await Promise.all([
                fetchStudentNotificationsAction(5),
                fetchStudentNotificationsCountAction()
            ])

            if (notifRes.notifications) {
                setNotifications(notifRes.notifications)
            }
            if (typeof countRes.count === 'number') {
                setCount(countRes.count)
            }
        } catch (error) {
            console.error('Failed to load notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 60000) // Every minute
        return () => clearInterval(interval)
    }, [])

    const trigger = (
        <button className="group relative flex size-10 items-center justify-center rounded-full border border-border-color bg-white text-text-secondary transition-all hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10 shadow-sm">
            <Bell className="size-5 transition-transform group-hover:rotate-12" />
            {count > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[8px] font-black text-white dark:border-[#1e1429] animate-pulse">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    )

    const content = (
        <div className="flex w-full flex-col bg-white dark:bg-[#1e1429] md:w-[380px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-white/5 dark:bg-[#1e1429]">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black    text-slate-900 dark:text-white">Notifications</h3>
                </div>
                {count > 0 ? (
                    <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 dark:bg-red-500/10 dark:border-red-500/20">
                        {count} NEW
                    </span>
                ) : (
                    <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                        ALL CLEAR
                    </span>
                )}
            </div>

            {/* List Body */}
            <div className="max-h-[420px] flex-1 overflow-y-auto scrollbar-hide">
                {loading && notifications.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" style={{ borderTopColor: brandColor }}></div>
                        <p className="text-sm font-medium text-slate-500">Checking for updates...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-white/5">
                            <Bell className="size-10 text-slate-200 dark:text-slate-700" />
                        </div>
                        <p className="mb-1.5 text-base font-black text-slate-800 dark:text-white">You're all caught up!</p>
                        <p className="px-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Check back later for new simulations and program updates.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 dark:divide-white/5">
                        {notifications.map((notif) => (
                            <Link
                                key={notif.id}
                                href={`/student/library?id=${notif.metadata?.simulationId}`}
                                onClick={() => setIsOpen(false)}
                                className="group relative flex gap-4 p-5 transition-all duration-200 hover:bg-slate-50/60 dark:hover:bg-white/5"
                            >
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/5 transition-transform group-hover:scale-105" style={{ backgroundColor: brandColor + '10', color: brandColor }}>
                                    <Sparkles className="size-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-start justify-between">
                                        <p className="pr-2 truncate text-[14px] font-black    text-slate-900 dark:text-white">
                                            {notif.title}
                                        </p>
                                        <span className="whitespace-nowrap pt-0.5 text-[11px] font-bold text-slate-400">
                                            {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="mb-3 text-[13px] leading-snug text-slate-600 dark:text-slate-400">
                                        {notif.content}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 rounded-md border border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary" style={{ borderColor: brandColor + '20', backgroundColor: brandColor + '10', color: brandColor }}>
                                            <Rocket size={12} />
                                            <span>Explore Now</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                <Link
                    href="/student/library"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[12px] font-black uppercase tracking-widest text-slate-700 shadow-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
                >
                    View All Simulations
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
    )

    return (
        <Popover
            trigger={trigger}
            content={content}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            align="right"
        />
    )
}
