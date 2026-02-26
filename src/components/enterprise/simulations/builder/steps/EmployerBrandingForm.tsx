import { useState, useEffect, useCallback, useRef } from "react";
import { getSimulation, updateSimulation, uploadAsset } from "@/actions/simulations";
import { FILE_VALIDATION, validateFileType, validateFileSize } from "@/lib/s3/shared";
import { cn } from "@/lib/utils";
import RichTextEditor from "../RichTextEditor";
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Globe } from "lucide-react";

interface EmployerBrandingFormProps {
    simulationId: string;
    saveTrigger?: number;
    onSaveSuccess?: () => void;
    onNext: () => void;
    onBack: () => void;
    certificateEnabled?: boolean;
    orgBranding?: any;
}

export default function EmployerBrandingForm({
    simulationId,
    saveTrigger,
    onSaveSuccess,
    onNext,
    onBack,
    certificateEnabled = true,
    orgBranding
}: EmployerBrandingFormProps) {
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

    const [errors, setErrors] = useState<Record<string, string>>({});

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
        let mounted = true;
        const load = async () => {
            console.log("Loading simulation data for:", simulationId);
            try {
                const result = await getSimulation(simulationId);
                if (mounted && result.data) {
                    console.log("Loaded data:", result.data);

                    if (result.data.organization_id) {
                        // Branding is now handled at the parent level and passed via prop
                    }

                    setFormData(prev => ({
                        ...prev,
                        company_logo_url: result.data.company_logo_url || prev.company_logo_url || '',
                        banner_url: result.data.banner_url || prev.banner_url || '',
                        intro_video_url: result.data.intro_video_url || prev.intro_video_url || '',
                        about_company: result.data.about_company || prev.about_company || '',
                        why_work_here: result.data.why_work_here || prev.why_work_here || '',
                    }));
                }
            } catch (error) {
                console.error("Failed to load simulation:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [simulationId]);

    // Enforce Org Defaults - Branding is now passed as a prop, but we still want to ensure formData stays in sync for the preview if needed
    // However, the rendering logic will prioritize orgBranding anyway.
    useEffect(() => {
        if (orgBranding?.logo_url) {
            setFormData(prev => ({ ...prev, company_logo_url: orgBranding.logo_url }));
        }
    }, [orgBranding]);



    const loadSimulation = async () => {
        try {
            const result = await getSimulation(simulationId);
            if (result.data) {
                // Only update if we have data, to avoid blowing away state with empty strings if fetch fails partially
                // But normally we trust the DB.
                setFormData(prev => ({
                    ...prev,
                    company_logo_url: result.data.company_logo_url || prev.company_logo_url || '',
                    banner_url: result.data.banner_url || prev.banner_url || '',
                    intro_video_url: result.data.intro_video_url || prev.intro_video_url || '',
                    about_company: result.data.about_company || prev.about_company || '',
                    why_work_here: result.data.why_work_here || prev.why_work_here || '',
                }));
            }
        } catch (error) {
            console.error("Failed to load simulation:", error);
        } finally {
            setLoading(false);
        }
    };

    const lastSaveTrigger = useRef(saveTrigger || 0);

    const handleSave = useCallback(async () => {
        if (loading) return; // Prevent saving before data is loaded

        // Prevent catastrophic empty saves
        if (!formData.company_logo_url &&
            !formData.banner_url &&
            !formData.about_company &&
            !formData.why_work_here) {
            return;
        }
        console.log("Saving Employer Branding Data:", formData);
        const result = await updateSimulation(simulationId, {
            ...formData,
            company_logo_url: orgBranding?.logo_url || formData.company_logo_url
        });
        if (result.error) {
            console.error("Save failed:", result.error);
            // Optionally set global error state here
        } else {
            onSaveSuccess?.();
        }
    }, [simulationId, formData, onSaveSuccess, loading]);

    // Handle external save trigger
    useEffect(() => {
        if (saveTrigger && saveTrigger > lastSaveTrigger.current) {
            handleSave();
            lastSaveTrigger.current = saveTrigger;
        }
    }, [saveTrigger, handleSave]);

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
            // Revoke old preview
            if (prev[assetType] && prev[assetType].startsWith('blob:')) {
                URL.revokeObjectURL(prev[assetType]);
            }
            return { ...prev, [assetType]: previewUrl };
        });

        setUploadStatuses(prev => ({ ...prev, [assetType]: 'uploading' }));

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('simulationId', simulationId);
            uploadFormData.append('assetType', assetType);

            const result = await uploadAsset(uploadFormData);

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.data) {
                setUploadStatuses(prev => ({ ...prev, [assetType]: 'success' }));

                const fieldMapping = {
                    logo: 'company_logo_url',
                    banner: 'banner_url',
                    video: 'intro_video_url'
                };
                const urlField = fieldMapping[assetType] as keyof typeof formData;
                const newUrl = result.data.url;

                console.log(`Asset uploaded (${assetType}):`, newUrl);

                // Update local state using functional update to avoid stale closure
                setFormData(prev => ({ ...prev, [urlField]: newUrl }));

                // Clear error
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[urlField];
                    return newErrors;
                });

                // Persist immediately to DB
                // NOTE: We only update the specific field to avoid overwriting other fields 
                // with stale data if verify/save runs concurrently.
                const updateResult = await updateSimulation(simulationId, { [urlField]: newUrl });
                if (updateResult.error) {
                    console.error("Failed to persist asset URL to simulation:", updateResult.error);
                    // Revert status to error if DB save fails
                    setUploadStatuses(prev => ({ ...prev, [assetType]: 'error' }));
                } else {
                    // Trigger success callback to update progress/green tick
                    onSaveSuccess?.();
                }
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadStatuses(prev => ({ ...prev, [assetType]: 'error' }));
            alert(error.message || "Upload failed");
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.company_logo_url) newErrors.company_logo_url = "Company logo is required";
        if (!formData.banner_url) newErrors.banner_url = "Program banner is required";
        if (!formData.about_company || formData.about_company === '<p><br></p>') newErrors.about_company = "Company description is required";
        if (!formData.why_work_here || formData.why_work_here === '<p><br></p>') newErrors.why_work_here = "Why Work Here section is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleNext = async () => {
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        await handleSave();
        onNext();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><span className="text-slate-400">Loading...</span></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-xl border border-primary/5 shadow-sm">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Employer Branding
                    </h2>
                    <p className="text-sm text-slate-500">
                        Define your company's culture and strategic positioning.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Logo and Banner Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Company Logo */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Company Logo
                            </label>

                            {orgBranding?.logo_url ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 border-2 border-solid border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                            <img
                                                src={orgBranding.logo_url}
                                                alt="Organization Logo"
                                                className="absolute inset-0 w-full h-full object-contain p-4"
                                            />
                                            <div className="absolute inset-0 bg-slate-50/10 dark:bg-slate-900/10 flex flex-col items-center justify-center pointer-events-none">
                                                <div className="bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-primary">lock</span>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Universal Org Asset</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic text-center">Managed at organization level</p>
                                </div>
                            ) : (
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full">
                                        <Globe className="size-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Setup Required</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                            Your company logo must be configured in <b>Organization Branding</b> settings.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => window.open('/enterprise/settings?tab=branding', '_blank')}
                                        className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                    >
                                        Go to Settings
                                    </button>
                                </div>
                            )}

                            {errors.company_logo_url && !orgBranding?.logo_url && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.company_logo_url}</p>}
                        </div>


                        {/* Program Banner */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Program Banner
                            </label>
                            <div className={`aspect-video bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 text-center group hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all overflow-hidden relative ${errors.banner_url ? 'border-red-300 ring-1 ring-red-300/50' : ''}`}>
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
                                        <div className="mb-2 p-3 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">image</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload Banner (1200x400)</p>
                                    </div>
                                )}

                                {uploadStatuses.banner === 'uploading' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 z-10">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
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
                            {errors.banner_url && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.banner_url}</p>}

                            {/* Guidelines */}
                            <div className="mt-3 space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Required</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc pl-3">
                                        <li>Resolution: 1200x400px (Exact)</li>
                                        <li>Aspect Ratio: 3:1</li>
                                        <li>Format: PNG or JPG</li>
                                    </ul>
                                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc pl-3">
                                        <li>Keep text centered (avoid edge cropping)</li>
                                        <li>Use high contrast fonts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            'Why Work Here' Video Content
                        </label>
                        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all relative overflow-hidden">
                            {previewUrls.video || formData.intro_video_url ? (
                                <div className="text-sm text-slate-600 dark:text-slate-300 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-green-500 mb-2 text-2xl">check_circle</span>
                                    <p className="font-bold text-slate-900 dark:text-white">Video Ready</p>
                                    <p className="text-xs text-slate-400">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">videocam</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to upload culture video</p>
                                    <p className="text-xs text-slate-400 mt-1">MP4 or MOV, max 500MB</p>
                                </>
                            )}

                            {uploadStatuses.video === 'uploading' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                                    <p className="text-xs text-primary font-bold uppercase tracking-wider">Uploading...</p>
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
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                About the Company
                            </label>
                            <RichTextEditor
                                value={formData.about_company}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, about_company: val }));
                                    if (errors.about_company) {
                                        const newErrors = { ...errors };
                                        delete newErrors.about_company;
                                        setErrors(newErrors);
                                    }
                                }}
                                placeholder="Describe your company culture, mission, and achievements..."
                                minHeight="240px"
                            />
                            {errors.about_company && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.about_company}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Why Work Here
                            </label>
                            <RichTextEditor
                                value={formData.why_work_here}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, why_work_here: val }));
                                    if (errors.why_work_here) {
                                        const newErrors = { ...errors };
                                        delete newErrors.why_work_here;
                                        setErrors(newErrors);
                                    }
                                }}
                                placeholder="What makes your company unique? Mention benefits, growth opportunities, etc."
                                minHeight="240px"
                            />
                            {errors.why_work_here && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-wide">{errors.why_work_here}</p>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center sm:justify-start gap-2"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center sm:justify-start gap-2"
                    >
                        {certificateEnabled ? 'Continue to Certification' : 'Continue to Visibility'}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
