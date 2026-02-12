"use client";

import { useState, useEffect } from "react";
import { getSimulation, updateSimulation, uploadAsset } from "@/actions/simulations";
import { FILE_VALIDATION, validateFileType, validateFileSize } from "@/lib/s3";
import { cn } from "@/lib/utils";

interface EmployerBrandingFormProps {
    simulationId: string;
    onNext: () => void;
    onBack: () => void;
}

export default function EmployerBrandingForm({ simulationId, onNext, onBack }: EmployerBrandingFormProps) {
    const [formData, setFormData] = useState({
        company_logo_url: '',
        banner_url: '',
        intro_video_url: '',
        about_company: '',
        why_work_here: '',
    });
    const [uploadStatuses, setUploadStatuses] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({
        logo: 'idle',
        banner: 'idle',
        video: 'idle',
    });
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({
        logo: '',
        banner: '',
        video: '',
    });
    const [loading, setLoading] = useState(true);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(previewUrls).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewUrls]);

    useEffect(() => {
        loadSimulation();
    }, [simulationId]);

    const loadSimulation = async () => {
        const result = await getSimulation(simulationId);
        if (result.data) {
            setFormData({
                company_logo_url: result.data.company_logo_url || '',
                banner_url: result.data.banner_url || '',
                intro_video_url: result.data.intro_video_url || '',
                about_company: result.data.about_company || '',
                why_work_here: result.data.why_work_here || '',
            });
        }
        setLoading(false);
    };

    const handleFileUpload = async (file: File, assetType: 'logo' | 'banner' | 'video') => {
        // Validate file
        const validation = FILE_VALIDATION[assetType.toUpperCase() as keyof typeof FILE_VALIDATION];
        if (!validateFileType(file, validation.allowedTypes)) {
            alert(`Invalid file type. Allowed: ${validation.allowedTypes.join(', ')}`);
            return;
        }
        if (!validateFileSize(file, validation.maxSizeMB)) {
            alert(`File too large. Maximum size: ${validation.maxSizeMB}MB`);
            return;
        }

        // Create local preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => {
            // Revoke old preview if exists
            if (prev[assetType] && prev[assetType].startsWith('blob:')) {
                URL.revokeObjectURL(prev[assetType]);
            }
            return { ...prev, [assetType]: previewUrl };
        });

        setUploadStatuses(prev => ({ ...prev, [assetType]: 'uploading' }));

        // Use FormData for server action
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('simulationId', simulationId);
        uploadFormData.append('assetType', assetType);

        const result = await uploadAsset(uploadFormData);

        if (result.error) {
            setUploadStatuses(prev => ({ ...prev, [assetType]: 'error' }));
            alert(result.error);
        } else if (result.data) {
            setUploadStatuses(prev => ({ ...prev, [assetType]: 'success' }));

            // Update form data with new URL
            const fieldMapping = {
                logo: 'company_logo_url',
                banner: 'banner_url',
                video: 'intro_video_url'
            };
            const urlField = fieldMapping[assetType] as keyof typeof formData;
            setFormData(prev => ({ ...prev, [urlField]: result.data!.url }));

            // Save to simulation
            await updateSimulation(simulationId, { [urlField]: result.data.url });
        }
    };

    const handleSave = async () => {
        await updateSimulation(simulationId, formData);
    };

    const handleNext = async () => {
        await handleSave();
        onNext();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><span className="text-slate-400">Loading...</span></div>;
    }

    return (
        <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employer Branding</h2>
                    <p className="text-sm text-slate-500">Showcase your company culture to prospective talent.</p>
                </div>

                <div className="space-y-6">
                    {/* Logo and Banner Upload */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Company Logo */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Company Logo
                            </label>
                            <div className="aspect-square bg-background-light dark:bg-slate-800 border-2 border-dashed border-primary/10 rounded-xl flex flex-col items-center justify-center p-4 text-center group hover:border-primary/40 cursor-pointer transition-all relative overflow-hidden">
                                {previewUrls.logo || formData.company_logo_url ? (
                                    <img
                                        src={previewUrls.logo || formData.company_logo_url}
                                        alt="Logo"
                                        className={cn(
                                            "absolute inset-0 w-full h-full object-contain p-4 transition-opacity",
                                            uploadStatuses.logo === 'uploading' ? 'opacity-50' : 'opacity-100'
                                        )}
                                    />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-primary/40 group-hover:text-primary mb-2">add_photo_alternate</span>
                                        <p className="text-[10px] text-slate-400 font-semibold">Upload PNG/SVG</p>
                                    </>
                                )}

                                {uploadStatuses.logo === 'uploading' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 z-10">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Uploading...</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/png,image/svg+xml,image/jpeg"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    disabled={uploadStatuses.logo === 'uploading'}
                                />
                            </div>
                        </div>

                        {/* Program Banner */}
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Program Banner
                            </label>
                            <div className="aspect-video bg-background-light dark:bg-slate-800 border-2 border-dashed border-primary/10 rounded-xl flex flex-col items-center justify-center p-4 text-center group hover:border-primary/40 cursor-pointer transition-all overflow-hidden relative">
                                {previewUrls.banner || formData.banner_url ? (
                                    <img
                                        src={previewUrls.banner || formData.banner_url}
                                        alt="Banner"
                                        className={cn(
                                            "absolute inset-0 w-full h-full object-cover transition-opacity",
                                            uploadStatuses.banner === 'uploading' ? 'opacity-50' : 'opacity-100'
                                        )}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-primary/40 group-hover:text-primary mb-2">image</span>
                                        <p className="text-[10px] text-slate-400 font-semibold">Upload Banner (1200x400)</p>
                                    </div>
                                )}

                                {uploadStatuses.banner === 'uploading' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 z-10">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Uploading...</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'banner')}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    disabled={uploadStatuses.banner === 'uploading'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            'Why Work Here' Video Content
                        </label>
                        <div className="w-full bg-background-light dark:bg-slate-800 border-2 border-dashed border-primary/10 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/40 cursor-pointer transition-all relative overflow-hidden">
                            {previewUrls.video || formData.intro_video_url ? (
                                <div className="text-sm text-slate-600 dark:text-slate-300 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-green-500 mb-2">check_circle</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">Video Ready</p>
                                    <p className="text-[10px] text-slate-400">Click to change video</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">videocam</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to upload culture video</p>
                                    <p className="text-xs text-slate-400 mt-1">MP4 or MOV, max 500MB</p>
                                </>
                            )}

                            {uploadStatuses.video === 'uploading' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                                    <p className="text-xs text-primary font-bold uppercase tracking-wider">Uploading Video...</p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic">This may take a while depending on file size</p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="video/mp4,video/quicktime"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                disabled={uploadStatuses.video === 'uploading'}
                            />
                        </div>
                    </div>

                    {/* Text Fields */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            About the Company
                        </label>
                        <textarea
                            value={formData.about_company}
                            onChange={(e) => setFormData(prev => ({ ...prev, about_company: e.target.value }))}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="Tell candidates about your company..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Why Work Here
                        </label>
                        <textarea
                            value={formData.why_work_here}
                            onChange={(e) => setFormData(prev => ({ ...prev, why_work_here: e.target.value }))}
                            className="w-full bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            placeholder="What makes your company a great place to work..."
                            rows={4}
                        />
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Metadata
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    Continue to Learning Outcomes
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
