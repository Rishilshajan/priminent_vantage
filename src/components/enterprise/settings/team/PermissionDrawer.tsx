"use client"

import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface PermissionDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function PermissionDrawer({ isOpen, onClose }: PermissionDrawerProps) {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-[420px] bg-white dark:bg-[#1f1629] shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Permissions</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Role: Content Creator</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Checklist Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Content & Simulation</h4>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 group cursor-pointer">
                                <Checkbox defaultChecked className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Create Simulation</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Allows user to design and initiate new system scenarios.</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 group cursor-pointer">
                                <Checkbox defaultChecked className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Edit Media Library</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Grant access to modify global asset folders.</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 group cursor-pointer">
                                <Checkbox className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Public Publishing</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">User can publish projects to external stakeholders.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Data Management</h4>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 group cursor-pointer">
                                <Checkbox defaultChecked className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Export Data</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Download CSV/PDF reports of analytic datasets.</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 group cursor-pointer">
                                <Checkbox className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Wipe Analytics</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Reset tracking data for specific projects.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Administrative</h4>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 group cursor-pointer opacity-50">
                                <Checkbox disabled className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Manage Billing</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Only accessible to Super Admins and Billing leads.</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 group cursor-pointer opacity-50">
                                <Checkbox disabled className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Delete Users</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Restricted permission for organizational security.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                    <Button className="flex-1 bg-primary text-white font-bold hover:bg-primary/90 text-sm h-10">
                        Save Permissions
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="px-4 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm h-10 hover:bg-white dark:hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    )
}
