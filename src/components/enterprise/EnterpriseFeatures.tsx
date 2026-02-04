"use client";

import { CheckCircle2, Eye, Users2 } from "lucide-react";

const features = [
    {
        icon: CheckCircle2,
        title: "Build high-intent talent pipelines",
        description: "Identify candidates who have already demonstrated the skills needed for the job through simulations.",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
        icon: Eye,
        title: "Showcase your company culture",
        description: "Give students a realistic preview of what it's like to work at your company before they apply.",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
        icon: Users2,
        title: "Reach diverse candidates at scale",
        description: "Democratize access to your roles by reaching students from any background, anywhere in the world.",
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
];

export function EnterpriseFeatures() {
    return (
        <div className="space-y-8 mt-8">
            {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                    <div className={`shrink-0 size-12 rounded-full ${feature.bgColor} ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
