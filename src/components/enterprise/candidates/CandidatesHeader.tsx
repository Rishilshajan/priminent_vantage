"use client"

import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"

export default function CandidatesHeader() {
    return (
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#1f1629]/80 backdrop-blur-md border-b border-primary/5 px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-3xl font-black text-[#140d1b] dark:text-white tracking-tight">Candidates</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage and track candidate performance across all enterprise job simulations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 px-4 h-10 bg-primary/10 text-primary font-bold text-sm rounded-lg hover:bg-primary/20 border-transparent transition-colors">
                        <Upload className="size-4" />
                        Export Report
                    </Button>
                    <Button className="flex items-center gap-2 px-4 h-10 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all">
                        <Plus className="size-4" />
                        Add Candidate
                    </Button>
                </div>
            </div>
        </header>
    )
}
