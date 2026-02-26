import { BookOpen, Microscope, Video } from "lucide-react";

interface TaskOverviewProps {
    activeTask: any;
    simulation: any;
    activeTaskIndex: number;
    subStep: number;
}

export function TaskOverview({ activeTask, simulation, activeTaskIndex, subStep }: TaskOverviewProps) {
    const videoUrl = activeTask.welcome_video_url;
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

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Task Overview
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                    {activeTask.title}
                </p>

                <div className="mt-8 p-8 bg-purple-500/5 dark:bg-purple-500/10 rounded-[32px] border border-purple-500/10 dark:border-purple-500/20 shadow-sm">
                    <h3 className="text-[10px] font-black text-purple-600/60 dark:text-purple-400/60 uppercase tracking-widest mb-6 px-1">Quick Brief</h3>
                    <div className="prose prose-sm prose-purple dark:prose-invert max-w-none
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed
                        prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:font-medium
                        prose-ol:list-decimal prose-ul:list-disc"
                        dangerouslySetInnerHTML={{
                            __html: (activeTask.description || "")
                                .replace(/•/g, "<br/>•")
                                .replace(/Step (\d+):/g, "<br/><strong class='text-slate-900 dark:text-white'>Step $1:</strong>")
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 transition-all group shadow-sm">
                    <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                        < BookOpen className="size-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-display font-black tracking-tight mb-4 text-slate-900 dark:text-white">What you'll learn</h3>
                    <div className="space-y-4">
                        {(activeTask.learning_objectives || activeTask.what_you_learn || []).map((objective: any, i: number) => (
                            <div key={i} className="flex gap-3">
                                <div className="size-1.5 rounded-full bg-blue-500 mt-2 shrink-0 opacity-40" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    {objective.text || objective}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 transition-all group shadow-sm">
                    <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                        <Microscope className="size-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-display font-black tracking-tight mb-4 text-slate-900 dark:text-white">What you'll do</h3>
                    <div className="prose prose-sm prose-purple dark:prose-invert max-w-none
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed
                        prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:font-medium
                        prose-ol:list-decimal prose-ul:list-disc"
                        dangerouslySetInnerHTML={{
                            __html: (activeTask.what_you_do || activeTask.instructions || "")
                                .replace(/•/g, "<br/>•")
                                .replace(/Step (\d+):/g, "<br/><strong class='text-slate-900 dark:text-white'>Step $1:</strong>")
                        }}
                    />
                </div>
            </div>

            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Message from {simulation.organization_name}</h2>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-10 border border-slate-100 dark:border-white/5">
                    {!videoUrl ? (
                        <div className="aspect-video bg-slate-100 dark:bg-white/5 rounded-[24px] mb-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <Video className="size-12 text-slate-300 mb-4" />
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No Introduction Video Available</p>
                        </div>
                    ) : isYouTube ? (
                        <div className="aspect-video bg-black rounded-[24px] mb-8 overflow-hidden shadow-2xl">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video bg-black rounded-[24px] mb-8 overflow-hidden relative group shadow-2xl">
                            <video
                                key={`${activeTaskIndex}-${subStep}`}
                                controls
                                className="w-full h-full object-cover"
                                poster={simulation.banner_url || ""}
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
