import { useState, useEffect } from "react"
import { History, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryEvent {
    status: string;
    date: string;
    actor: string;
}

interface ReviewHistoryProps {
    events: HistoryEvent[];
}

const ITEMS_PER_PAGE = 5;

export function ReviewHistory({ events }: ReviewHistoryProps) {
    const [mounted, setMounted] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Filter out individual checklist updates if any exist from legacy state
    const filteredEvents = events.filter(e =>
        !e.status.includes('Checked "') &&
        !e.status.includes('Unchecked "') &&
        !e.status.toLowerCase().includes('checklist updated')
    );

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                    <History className="size-4 text-primary" />
                    Review History
                </h3>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                            {currentPage + 1}/{totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6">
                {paginatedEvents.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-[10px] text-slate-400 font-medium italic">No milestones yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6 relative">
                        {paginatedEvents.map((event, index) => {
                            const isApproval = event.status.toLowerCase().includes('approve') || event.status.toLowerCase().includes('intake') || event.status.toLowerCase().includes('verified');
                            const isRejection = event.status.toLowerCase().includes('reject');
                            const isClarification = event.status.toLowerCase().includes('clarification') || event.status.toLowerCase().includes('review started');
                            const isNote = event.status.toLowerCase().includes('note');
                            const isDraft = event.status.toLowerCase().includes('draft');

                            return (
                                <div key={index} className="flex gap-3 relative z-10">
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-1 shrink-0",
                                        isApproval ? "bg-green-500" :
                                            isRejection ? "bg-red-500" :
                                                isClarification ? "bg-orange-500" :
                                                    isNote ? "bg-blue-500" :
                                                        isDraft ? "bg-purple-500" :
                                                            "bg-slate-300"
                                    )} />
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                            {event.status}
                                        </p>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                {mounted ? event.date : ""}
                                            </p>
                                            {event.actor && event.actor !== "System" && (
                                                <p className="text-[10px] text-primary/70 font-bold uppercase tracking-tight">
                                                    • {event.actor}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
