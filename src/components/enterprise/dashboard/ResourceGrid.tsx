"use client"

import { FileUp, BookOpen, ArrowRight } from "lucide-react"

export default function ResourceGrid() {
    const resources = [
        {
            title: "Simulation Builder",
            desc: "Author new case studies, upload multimedia assets, and configure grading rubrics for custom simulations.",
            icon: <FileUp className="size-6" />,
            bgColor: "bg-primary/10",
            textColor: "text-primary",
            hoverBg: "group-hover:bg-primary group-hover:text-white",
            href: "/enterprise/simulations/create"
        },
        {
            title: "Content Library",
            desc: "Manage your global repository of learning objects, task templates, and departmental curriculum alignment.",
            icon: <BookOpen className="size-6" />,
            bgColor: "bg-blue-50 dark:bg-blue-500/10",
            textColor: "text-blue-600",
            hoverBg: "group-hover:bg-blue-600 group-hover:text-white",
            href: "/enterprise/simulations"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
                <a
                    href={res.href}
                    key={res.title}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/40 transition-all group cursor-pointer block"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className={`size-12 rounded-2xl ${res.bgColor} ${res.textColor} flex items-center justify-center ${res.hoverBg} transition-all duration-300`}>
                            {res.icon}
                        </div>
                        <ArrowRight className="size-5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                    <h4 className="font-black text-lg mb-2 text-slate-900 dark:text-white   ">{res.title}</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">{res.desc}</p>
                </a>
            ))}
        </div>
    )
}
