"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    align?: "left" | "right";
    className?: string;
}

export function Popover({ trigger, content, isOpen, setIsOpen, align = "right", className }: PopoverProps) {
    const popoverRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    return (
        <div className="relative" ref={popoverRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={cn(
                        "absolute top-full z-[100] mt-2 w-screen max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200 dark:border-white/10 dark:bg-[#1e1429]",
                        align === "right" ? "right-0" : "left-0",
                        className
                    )}
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
