"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Type
} from 'lucide-react';

interface ToolbarButton {
    icon: React.ReactNode;
    label: string;
    command?: string;
    value?: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Start typing...",
    minHeight = "200px"
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Initial value set
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string = '') => {
        editorRef.current?.focus();
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(command, false, value);
        handleInput();
        checkActiveStates();
    };

    // Active state tracking
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const [activeBlock, setActiveBlock] = useState<string>('');

    const checkActiveStates = () => {
        if (!editorRef.current) return;

        // Check boolean states
        const newFormats: Record<string, boolean> = {};
        ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight'].forEach(cmd => {
            newFormats[cmd] = document.queryCommandState(cmd);
        });
        setActiveFormats(newFormats);

        // Check block value
        const blockValue = document.queryCommandValue('formatBlock');
        setActiveBlock(blockValue);
    };

    const handleSelectionChange = () => {
        checkActiveStates();
    };

    const toolbarGroups: ToolbarButton[][] = [
        [
            { icon: <Bold size={16} />, command: 'bold', label: 'Bold', isActive: activeFormats['bold'] },
            { icon: <Italic size={16} />, command: 'italic', label: 'Italic', isActive: activeFormats['italic'] },
            { icon: <Underline size={16} />, command: 'underline', label: 'Underline', isActive: activeFormats['underline'] },
        ],
        [
            { icon: <Type size={16} />, command: 'formatBlock', value: 'p', label: 'Normal Text', isActive: activeBlock === 'p' || activeBlock === 'div' || !activeBlock },
            { icon: <Heading1 size={16} />, command: 'formatBlock', value: 'h1', label: 'H1', isActive: activeBlock === 'h1' },
            { icon: <Heading2 size={16} />, command: 'formatBlock', value: 'h2', label: 'h2', isActive: activeBlock === 'h2' },
        ],
        [
            { icon: <List size={16} />, command: 'insertUnorderedList', label: 'Bullet List', isActive: activeFormats['insertUnorderedList'] },
            { icon: <ListOrdered size={16} />, command: 'insertOrderedList', label: 'Numbered List', isActive: activeFormats['insertOrderedList'] },
        ],
        [
            { icon: <AlignLeft size={16} />, command: 'justifyLeft', label: 'Align Left', isActive: activeFormats['justifyLeft'] },
            { icon: <AlignCenter size={16} />, command: 'justifyCenter', label: 'Align Center', isActive: activeFormats['justifyCenter'] },
            { icon: <AlignRight size={16} />, command: 'justifyRight', label: 'Align Right', isActive: activeFormats['justifyRight'] },
        ],
        [
            { icon: <Code size={16} />, command: 'formatBlock', value: 'pre', label: 'Code Block', isActive: activeBlock === 'pre' },
        ],
    ];

    return (
        <div className={`
            flex flex-col border rounded-xl transition-all duration-200 overflow-hidden
            ${isFocused
                ? 'border-primary ring-4 ring-primary/5 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-800/20'}
        `}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-primary/5 bg-slate-50/30 dark:bg-slate-900/50 backdrop-blur-sm">
                {toolbarGroups.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                        {gIdx > 0 && <div className="w-[1px] h-4 bg-primary/10 mx-1 hidden sm:block" />}
                        {group.map((btn, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (btn.onClick) {
                                        btn.onClick();
                                    } else if (btn.command) {
                                        // Toggle logic for formatBlock
                                        if (btn.command === 'formatBlock' && btn.isActive) {
                                            execCommand('formatBlock', 'p');
                                        } else {
                                            execCommand(btn.command, btn.value || '');
                                        }
                                    }
                                }}
                                className={`
                                    p-2 rounded-lg transition-all border
                                    ${btn.isActive
                                        ? 'bg-primary/10 text-primary border-primary/20 shadow-inner'
                                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-slate-200 border-transparent hover:border-primary/10 hover:shadow-sm'
                                    }
                                `}
                                title={btn.label}
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={() => {
                    handleInput();
                    checkActiveStates();
                }}
                onKeyUp={handleSelectionChange}
                onMouseUp={handleSelectionChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    p-6 outline-none text-sm leading-relaxed 
                    text-slate-600 dark:text-slate-300
                    max-w-none w-full
                    whitespace-pre-wrap break-words
                    
                    [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:mb-4 [&_h1]:mt-6
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mb-3 [&_h2]:mt-5
                    
                    [&_p]:mb-3 [&_p]:leading-7
                    
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
                    [&_li]:pl-1
                    
                    [&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:mb-4 [&_pre]:whitespace-pre-wrap [&_pre]:break-words
                    
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                    
                    [&_b]:font-bold [&_strong]:font-bold
                    [&_i]:italic [&_em]:italic
                    [&_u]:underline
                    
                    ${!value ? 'before:content-[attr(data-placeholder)] before:text-slate-400 before:pointer-events-none before:absolute before:inset-6' : ''}
                    relative
                `}
                style={{
                    minHeight,
                    // Force list styles if prose fails
                    // @ts-ignore
                    '--tw-prose-bullets': '#6366f1',
                    '--tw-prose-counters': '#6366f1',
                    // Fallback for H1/H2 if prose is missing
                    '--tw-prose-headings': '#0f172a',
                } as any}
                data-placeholder={placeholder}
            />
        </div>
    );
}
