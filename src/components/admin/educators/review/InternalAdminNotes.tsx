"use client"

import { MessageSquare, Send, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Note {
    id?: string;
    author: string;
    date: string;
    content: string;
    avatar?: string;
}

interface InternalAdminNotesProps {
    notes: Note[];
    onAddNote: (content: string) => void;
    isSaving?: boolean;
}

export function InternalAdminNotes({ notes, onAddNote, isSaving }: InternalAdminNotesProps) {
    const [newNote, setNewNote] = useState("")

    const handleSubmit = () => {
        if (!newNote.trim()) return
        onAddNote(newNote)
        setNewNote("")
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                    <MessageSquare className="size-4 text-primary" />
                    Internal Notes
                </h3>
            </div>

            <div className="p-6 pb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Observations</p>
                <div className="relative group mb-6">
                    <Textarea
                        placeholder="Add observations for other admins..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[80px] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-primary/20 focus:border-primary/50 rounded-xl p-3 text-xs transition-all resize-none shadow-none"
                    />
                    <div className="absolute bottom-2 right-2">
                        <Button
                            size="sm"
                            disabled={!newNote.trim() || isSaving}
                            onClick={handleSubmit}
                            className="h-8 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider px-3"
                        >
                            <Send className="size-3 mr-1.5" />
                            Add
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 pb-4">
                    {notes.map((note, index) => (
                        <div key={index} className="flex gap-3 group">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <User className="size-3 text-slate-400" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-900 dark:text-white">{note.author}</span>
                                    <span className="text-[9px] text-slate-400 font-medium">{note.date}</span>
                                </div>
                                <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
