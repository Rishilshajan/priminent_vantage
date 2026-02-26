"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyInvitationAction, acceptInvitationAction } from '@/actions/enterprise/enterprise-management.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { authService } from '@/lib/auth/auth.service';

interface AcceptInvitationViewProps {
    token: string | null;
}

export function AcceptInvitationView({ token }: AcceptInvitationViewProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invitation, setInvitation] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invitation token is missing');
            setLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const result = await verifyInvitationAction(token);
                if (result.success) {
                    setInvitation(result.data);
                } else {
                    setError(result.error || 'Invalid or expired invitation');
                }
            } catch (err) {
                setError('Failed to verify invitation');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const [success, setSuccess] = useState(false);

    const handleAccept = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !invitation) return;

        setVerifying(true);
        setError(null);

        try {
            // 1. Sign up user via Supabase Auth
            const signUpResult = await authService.signUp({
                email: invitation.email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        role: invitation.role
                    }
                }
            });

            if (signUpResult.error) {
                setError(signUpResult.error.message);
                setVerifying(false);
                return;
            }

            const userId = signUpResult.data.user?.id;
            if (!userId) throw new Error('User creation failed');

            // 2. Link to organization and accept invitation via server action
            const acceptResult = await acceptInvitationAction(token, userId);

            if (acceptResult.success) {
                setSuccess(true);
                // Optionally auto-redirect after a delay
                setTimeout(() => router.push('/enterprise/dashboard'), 3000);
            } else {
                setError(acceptResult.error || 'Failed to link account to organization');
            }
        } catch (err) {
            setError('An unexpected error occurred during setup');
        } finally {
            setVerifying(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="size-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                        <CheckCircle2 className="size-10 text-white" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Successfully Joined!</h1>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Welcome to <span className="text-slate-900 dark:text-white font-black">{invitation.organizations?.name}</span>.
                            Your account is now active and ready.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={() => router.push('/enterprise/dashboard')}
                            className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all shadow-xl"
                        >
                            Go to Dashboard
                        </Button>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                            Auto-redirecting in a few seconds...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <Loader2 className="size-10 animate-spin text-primary mx-auto" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Verifying Invite...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-6">
                    <div className="size-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle className="size-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Access Denied</h1>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{error}</p>
                    </div>
                    <Button
                        onClick={() => router.push('/enterprise/login')}
                        className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">

                    {/* Visual Side */}
                    <div className="bg-primary p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                <ShieldCheck className="size-6" />
                            </div>
                            <h2 className="text-3xl font-black leading-tight tracking-tight mb-4">You've Been Invited!</h2>
                            <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Platform Onboarding</p>
                        </div>

                        <div className="space-y-6 relative z-10 mt-12 md:mt-0">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Building2 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Organization</p>
                                    <p className="text-sm font-black">{invitation.organizations?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Assigned Role</p>
                                    <p className="text-sm font-black uppercase tracking-widest">{invitation.role?.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 md:p-12">
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Complete Setup</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create your secure access</p>
                        </div>

                        <form onSubmit={handleAccept} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        disabled
                                        value={invitation.email}
                                        className="h-12 pl-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl opacity-60 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <Input
                                    required
                                    placeholder="Enter your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="h-12 px-5 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl font-bold placeholder:font-medium focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Create Password</label>
                                    {password && (
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${(() => {
                                            const policy = invitation.organizations?.enterprise_security_settings?.[0] || {
                                                min_password_length: 12,
                                                require_special_symbols: true,
                                                require_numeric_digits: true,
                                                require_mixed_case: false
                                            };
                                            const { passwordPolicyUtils } = require('@/lib/utils/password-policy');
                                            return passwordPolicyUtils.validatePassword(password, policy).isValid ? 'text-emerald-500' : 'text-rose-500';
                                        })()
                                            }`}>
                                            {(() => {
                                                const policy = invitation.organizations?.enterprise_security_settings?.[0] || {
                                                    min_password_length: 12,
                                                    require_special_symbols: true,
                                                    require_numeric_digits: true,
                                                    require_mixed_case: false
                                                };
                                                const { passwordPolicyUtils } = require('@/lib/utils/password-policy');
                                                const result = passwordPolicyUtils.validatePassword(password, policy);
                                                return result.isValid ? 'Strong Password' : 'Weak Password';
                                            })()}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`h-12 px-5 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl font-bold placeholder:font-medium focus:ring-4 transition-all ${password ? (
                                        (() => {
                                            const policy = invitation.organizations?.enterprise_security_settings?.[0] || {
                                                min_password_length: 12,
                                                require_special_symbols: true,
                                                require_numeric_digits: true,
                                                require_mixed_case: false
                                            };
                                            const { passwordPolicyUtils } = require('@/lib/utils/password-policy');
                                            return passwordPolicyUtils.validatePassword(password, policy).isValid ? 'focus:ring-emerald-500/10 border-emerald-500/20' : 'focus:ring-rose-500/10 border-rose-500/20';
                                        })()
                                    ) : 'focus:ring-primary/5'
                                        }`}
                                />
                                {password && (() => {
                                    const policy = invitation.organizations?.enterprise_security_settings?.[0] || {
                                        min_password_length: 12,
                                        require_special_symbols: true,
                                        require_numeric_digits: true,
                                        require_mixed_case: false
                                    };
                                    const { passwordPolicyUtils } = require('@/lib/utils/password-policy');
                                    const result = passwordPolicyUtils.validatePassword(password, policy);
                                    return !result.isValid && (
                                        <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 leading-tight">{result.error}</p>
                                    );
                                })()}
                            </div>

                            <Button
                                disabled={verifying || (() => {
                                    if (!password) return true;
                                    const policy = invitation.organizations?.enterprise_security_settings?.[0] || {
                                        min_password_length: 12,
                                        require_special_symbols: true,
                                        require_numeric_digits: true,
                                        require_mixed_case: false
                                    };
                                    const { passwordPolicyUtils } = require('@/lib/utils/password-policy');
                                    return !passwordPolicyUtils.validatePassword(password, policy).isValid;
                                })()}
                                className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all font-black uppercase tracking-[0.2em] text-xs"
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    "Join Organization"
                                )}
                            </Button>

                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                By joining, you agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
