import { FileText, Link as LinkIcon, Download, ExternalLink, Play, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ResourcesProps {
    activeTask: any;
}

export function Resources({ activeTask }: ResourcesProps) {
    const resources = activeTask.resources || [];
    const videoUrl = activeTask.video_url;
    const pdfUrl = activeTask.pdf_brief_url;

    // Video Embed Logic (Extracted from TaskOverview)
    const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
    let embedUrl = videoUrl;
    if (isYouTube) {
        if (videoUrl.includes('watch?v=')) {
            embedUrl = videoUrl.replace('watch?v=', 'embed/');
        } else if (videoUrl.includes('youtu.be/')) {
            const id = videoUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${id}`;
        }
    }

    const hasEssential = videoUrl || pdfUrl;
    const hasAdditional = resources.length > 0;

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4 text-left">
                <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                    Task Resources
                </h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                    Review the project brief and instructional materials before you start your implementation.
                </p>
            </div>

            {hasEssential && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pdfUrl && (
                        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 flex flex-col items-start transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/5 shadow-sm">
                            <div className="size-16 rounded-[24px] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 shadow-sm transition-all group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white">
                                <FileText className="size-8" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Project Brief</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Complete task requirements and technical specifications for this phase.</p>
                            </div>
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
                            >
                                <Download className="size-4" /> Download Brief
                            </a>
                        </div>
                    )}

                    {videoUrl && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 flex flex-col items-start transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/5 shadow-sm cursor-pointer">
                                    <div className="size-16 rounded-[24px] bg-purple-500/10 flex items-center justify-center text-purple-500 mb-8 shadow-sm transition-all group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white">
                                        <Play className="size-8 ml-1" />
                                    </div>
                                    <div className="space-y-2 flex-1 text-left">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Video Guide</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">A walkthrough of the scenario and expectations from the team lead.</p>
                                    </div>
                                    <div className="mt-8 w-full py-4 rounded-2xl bg-purple-500 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all group-hover:bg-purple-600 shadow-lg shadow-purple-500/20">
                                        <Play className="size-4" /> Watch Video
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-3xl">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Instructional Video</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video w-full">
                                    {isYouTube ? (
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            controls
                                            autoPlay
                                            className="w-full h-full object-cover"
                                        >
                                            <source src={videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}

            {hasAdditional && (
                <div className="space-y-8 pt-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Additional Materials</h3>
                        <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((resource: any, idx: number) => {
                            const isLink = resource.type === 'link' || resource.url?.startsWith('http');
                            return (
                                <div
                                    key={idx}
                                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 flex items-center justify-between hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "size-14 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110",
                                            isLink ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                                        )}>
                                            {isLink ? <LinkIcon className="size-6" /> : <FileText className="size-6" />}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {resource.title || (isLink ? 'External Link' : 'Resource File')}
                                            </h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {isLink ? 'Web Resource' : 'Document'}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={resource.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500 hover:text-white transition-all shadow-sm group-hover:scale-105 active:scale-95"
                                    >
                                        {isLink ? <ExternalLink className="size-4" /> : <Download className="size-4" />}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!hasAdditional && !hasEssential && (
                <div className="py-24 bg-slate-50 dark:bg-white/5 rounded-[48px] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center px-10 shadow-sm border-dashed">
                    <div className="size-24 rounded-[32px] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 mb-8 border border-slate-200 dark:border-slate-800">
                        <Video className="size-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No specific resources found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium leading-relaxed">Everything you need is already provided in the overview and background sections.</p>
                </div>
            )}
        </div>
    );
}
