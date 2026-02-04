"use client";

import { ArrowRight, PlayCircle, Code, Briefcase, Rocket, ChevronLeft, ChevronRight, Calculator, Megaphone, LineChart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const carouselItems = [
    {
        category: "MOST POPULAR",
        title: "Software Engineering",
        description: "Experience the day-to-day of a developer at a top tech firm.",
        color: "from-primary to-indigo-600",
        tasks: [
            { icon: Code, title: "Submit Code", sub: "Patch a software bug", color: "blue" },
            { icon: Briefcase, title: "System Design", sub: "Create a diagram", color: "green" },
        ],
    },
    {
        category: "FINANCE",
        title: "Investment Banking",
        description: "Analyze markets and assist clients with mergers and acquisitions.",
        color: "from-emerald-600 to-teal-600",
        tasks: [
            { icon: Calculator, title: "Financial Model", sub: "Value a company", color: "emerald" },
            { icon: LineChart, title: "Market Analysis", sub: "Research trends", color: "blue" },
        ],
    },
    {
        category: "CONSULTING",
        title: "Strategy Consulting",
        description: "Help clients solve complex business challenges and drive growth.",
        color: "from-blue-600 to-cyan-600",
        tasks: [
            { icon: LineChart, title: "Market Sizing", sub: "Estimate opportunity", color: "indigo" },
            { icon: Briefcase, title: "Client Deck", sub: "Present findings", color: "violet" },
        ],
    },
    {
        category: "MARKETING",
        title: "Digital Marketing",
        description: "Create compelling campaigns and track performance metrics.",
        color: "from-rose-500 to-pink-600",
        tasks: [
            { icon: Megaphone, title: "Campaign Plan", sub: "Define strategy", color: "rose" },
            { icon: LineChart, title: "Analytics", sub: "Review ROI", color: "orange" },
        ],
    },
    {
        category: "DATA SCIENCE",
        title: "Data Analytics",
        description: "Transform raw data into actionable business insights.",
        color: "from-violet-600 to-purple-600",
        tasks: [
            { icon: Code, title: "Data Cleaning", sub: "Prep the dataset", color: "violet" },
            { icon: LineChart, title: "Visualization", sub: "Build dashboard", color: "indigo" },
        ],
    },
];

export function HeroSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    return (
        <header className="relative pt-16 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 bg-background -z-20"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/30 skew-x-12 origin-top -z-10 hidden lg:block border-l border-border"></div>
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="mb-12 lg:mb-0 animate-fade-in-up">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                            <Rocket className="w-4 h-4 mr-2" />
                            Kickstart your career journey
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                            Your Future. <br />
                            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                                Simulated Today.
                            </span>
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                            Priminent Vantage bridges the gap between education and employment. Gain direct experience with virtual job simulations from the world&apos;s top companies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/signup"
                                className="bg-foreground text-background text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="bg-background text-foreground border border-border hover:border-primary text-lg font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-muted/50">
                                <PlayCircle className="w-5 h-5" />
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Carousel */}
                    <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in-up delay-200">
                        <div className="relative w-full max-w-md aspect-[4/5] mx-auto">

                            {/* Card Container */}
                            <div className="relative w-full h-full">

                                {/* Background Cards Stack Effect */}
                                <div className="absolute inset-0 bg-muted rounded-2xl transform translate-x-4 translate-y-4 opacity-50 z-0"></div>
                                <div className="absolute inset-0 bg-muted/80 rounded-2xl transform translate-x-2 translate-y-2 opacity-80 z-0"></div>

                                {/* Active Card */}
                                <div className="absolute inset-0 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col z-10 transition-all duration-500 ease-in-out">

                                    {carouselItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "absolute inset-0 flex flex-col transition-opacity duration-500 bg-card",
                                                index === activeIndex ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                            )}
                                        >
                                            <div className={`h-1/2 bg-gradient-to-br ${item.color} p-6 flex flex-col justify-end relative overflow-hidden`}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                                <div className="relative z-10">
                                                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">
                                                        {item.category}
                                                    </span>
                                                    <h3 className="text-3xl font-bold text-white mb-1">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-white/90">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="h-1/2 p-6 flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    {item.tasks.map((task, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                            <div className={`w-10 h-10 rounded bg-${task.color}-100 dark:bg-${task.color}-900/30 flex items-center justify-center text-${task.color}-600 dark:text-${task.color}-400 font-bold`}>
                                                                <task.icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">{task.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {task.sub}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-border flex justify-between items-center text-sm">
                                                    <span className="font-medium text-muted-foreground">
                                                        Average time: 5 hrs
                                                    </span>
                                                    <span className="font-bold text-primary">
                                                        Free Certificate
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted hover:scale-105 transition-all"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {/* Indicators */}
                                <div className="flex items-center gap-2">
                                    {carouselItems.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                                                idx === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-primary/50"
                                            )}
                                            onClick={() => setActiveIndex(idx)}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted hover:scale-105 transition-all"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
