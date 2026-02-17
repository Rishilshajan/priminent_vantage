"use client"

import { Image, GalleryThumbnails, Trash2, Plus } from "lucide-react"

export default function CommonBrandAssets() {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                    <GalleryThumbnails className="text-primary size-6" />
                    <h2 className="font-bold text-slate-900 dark:text-white">Common Brand Assets</h2>
                </div>
                <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                    <Plus className="size-4" />
                    Upload New
                </button>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="group relative aspect-video rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Image className="text-slate-400 dark:text-slate-500 size-8" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[9px] font-medium text-white truncate">Main_Banner.jpg</p>
                        </div>
                        <button className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-slate-800/90 rounded-md text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-all">
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                    <div className="group relative aspect-video rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Image className="text-slate-400 dark:text-slate-500 size-8" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[9px] font-medium text-white truncate">Simulation_Header.png</p>
                        </div>
                        <button className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-slate-800/90 rounded-md text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-all">
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                    <div className="group relative aspect-video rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Image className="text-slate-400 dark:text-slate-500 size-8" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[9px] font-medium text-white truncate">Winter_Campaign.jpg</p>
                        </div>
                        <button className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-slate-800/90 rounded-md text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-all">
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                        <Plus className="size-6" />
                    </div>
                </div>
            </div>
        </section>
    )
}
