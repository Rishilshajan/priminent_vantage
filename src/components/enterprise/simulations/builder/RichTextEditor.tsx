"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Code,
    Link as LinkIcon,
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
    };

    const addLink = () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString();

        const url = prompt("Enter the URL (e.g., https://google.com):", selectedText?.startsWith('http') ? selectedText : "");
        if (url) {
            // Ensure protocol
            const finalUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
            execCommand('createLink', finalUrl);
        }
    };

    const toolbarGroups: ToolbarButton[][] = [
        [
            { icon: <Bold size={16} />, command: 'bold', label: 'Bold' },
            { icon: <Italic size={16} />, command: 'italic', label: 'Italic' },
            { icon: <Underline size={16} />, command: 'underline', label: 'Underline' },
        ],
        [
            { icon: <Heading1 size={16} />, command: 'formatBlock', value: 'h1', label: 'H1' },
            { icon: <Heading2 size={16} />, command: 'formatBlock', value: 'h2', label: 'h2' },
        ],
        [
            { icon: <List size={16} />, command: 'insertUnorderedList', label: 'Bullet List' },
            { icon: <ListOrdered size={16} />, command: 'insertOrderedList', label: 'Numbered List' },
        ],
        [
            { icon: <AlignLeft size={16} />, command: 'justifyLeft', label: 'Align Left' },
            { icon: <AlignCenter size={16} />, command: 'justifyCenter', label: 'Align Center' },
            { icon: <AlignRight size={16} />, command: 'justifyRight', label: 'Align Right' },
        ],
        [
            { icon: <Code size={16} />, command: 'formatBlock', value: 'pre', label: 'Code Block' },
            { icon: <LinkIcon size={16} />, onClick: addLink, label: 'Add Link' },
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
                                        execCommand(btn.command, btn.value || '');
                                    }
                                }}
                                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-slate-200 border border-transparent hover:border-primary/10 hover:shadow-sm"
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
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    p-6 outline-none text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none min-h-[150px]
                    focus:prose-a:text-primary
                    prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-p:text-slate-600 dark:prose-p:text-slate-400
                    prose-li:text-slate-600 dark:prose-li:text-slate-400
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                    prose-h1:text-2xl prose-h1:font-black prose-h1:mb-4
                    prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3
                    prose-p:mb-2
                    ${!value ? 'before:content-[attr(data-placeholder)] before:text-slate-400 before:pointer-events-none' : ''}
                `}
                style={{
                    minHeight,
                    // Force list styles if prose fails
                    // @ts-ignore
                    '--tw-prose-bullets': '#6366f1',
                    '--tw-prose-counters': '#6366f1',
                } as any}
                data-placeholder={placeholder}
            />
        </div>
    );
}
