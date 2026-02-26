"use client"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface PasswordPolicySectionProps {
    policy: {
        min_password_length: number;
        password_expiration_days: number;
        require_special_symbols: boolean;
        require_numeric_digits: boolean;
        require_mixed_case: boolean;
    };
    onPolicyChange: (field: string, value: any) => void;
    disabled?: boolean;
}

export default function PasswordPolicySection({ policy, onPolicyChange, disabled }: PasswordPolicySectionProps) {
    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <span className="material-symbols-outlined text-primary text-2xl">password</span>
                <h2 className="font-bold text-slate-900 dark:text-white">Password Complexity Policy</h2>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Minimum Character Length</label>
                        <Input
                            className="w-full h-11 px-4 rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            type="number"
                            value={policy.min_password_length ?? ''}
                            onChange={(e) => onPolicyChange('min_password_length', e.target.value === '' ? '' : parseInt(e.target.value))}
                            disabled={disabled}
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">Standard recommendation: 12-16 characters.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Password Expiration (Days)</label>
                        <Input
                            className="w-full h-11 px-4 rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            type="number"
                            value={policy.password_expiration_days ?? ''}
                            onChange={(e) => onPolicyChange('password_expiration_days', e.target.value === '' ? '' : parseInt(e.target.value))}
                            disabled={disabled}
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">Set to 0 for no expiration.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all">
                        <Checkbox
                            checked={policy.require_special_symbols}
                            onCheckedChange={(checked) => onPolicyChange('require_special_symbols', checked)}
                            disabled={disabled}
                            className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Special Symbols</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all">
                        <Checkbox
                            checked={policy.require_numeric_digits}
                            onCheckedChange={(checked) => onPolicyChange('require_numeric_digits', checked)}
                            disabled={disabled}
                            className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Numeric Digits</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all">
                        <Checkbox
                            checked={policy.require_mixed_case}
                            onCheckedChange={(checked) => onPolicyChange('require_mixed_case', checked)}
                            disabled={disabled}
                            className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mixed Case</span>
                    </label>
                </div>
            </div>
        </section>
    )
}
