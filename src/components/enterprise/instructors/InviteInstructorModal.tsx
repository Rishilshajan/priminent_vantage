"use client";

import React, { useState } from 'react';
import { X, UserPlus, Mail, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { createInstructorInvitation } from '@/actions/enterprise/enterprise-management.actions';

interface InviteInstructorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInviteSuccess?: () => void;
}

const InviteInstructorModal = ({ isOpen, onClose, onInviteSuccess }: InviteInstructorModalProps) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'instructor' | 'enterprise_admin' | 'reviewer'>('instructor');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await createInstructorInvitation({ email, role });
            if (result.success) {
                setSuccess(true);
                setInviteUrl((result.data as any).inviteUrl);
                onInviteSuccess?.();
                // Optionally auto-close after delay
                // setTimeout(onClose, 3000);
            } else {
                setError(result.error || 'Failed to send invitation');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!inviteUrl) return;
        navigator.clipboard.writeText(inviteUrl);
        // Could add a toast here
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {success ? 'Invitation Created' : 'Invite New Specialist'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            {success ? 'Account setup link is ready for delivery.' : 'Add professionals to your organization workflow.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {success ? (
                    <div className="p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 text-center space-y-4">
                            <div className="size-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                <ShieldCheck className="size-8 text-white" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-400">Success!</h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-500/80 font-bold uppercase tracking-widest mt-1">Invite URL Generated</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Copy Secure Link</label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={inviteUrl || ''}
                                    className="flex-grow px-4 h-12 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-mono font-bold text-slate-500 overflow-hidden text-ellipsis"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => { setSuccess(false); setEmail(''); }}
                            className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            Invite Another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleInvite}>
                        <div className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-in shake duration-300">
                                    <AlertCircle className="size-5 shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Specialist Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        required
                                        className="w-full pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300 outline-none"
                                        placeholder="user@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'instructor', label: 'Instructor', icon: UserPlus },
                                        { id: 'reviewer', label: 'Reviewer', icon: ShieldCheck },
                                        { id: 'enterprise_admin', label: 'Admin', icon: ShieldCheck }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setRole(opt.id as any)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === opt.id
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                                                }`}
                                        >
                                            <opt.icon className="size-5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 dark:bg-slate-950/30 flex gap-4 justify-end border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 h-12 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                className="px-10 h-12 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                            >
                                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Send Invitation'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default InviteInstructorModal;
