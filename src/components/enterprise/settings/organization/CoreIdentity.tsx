"use client"

import { Badge, Upload, FileUp, Star } from "lucide-react"

interface CoreIdentityProps {
    logoUrl?: string | null;
    onLogoChange: (url: string) => void;
}

import { uploadOrganizationAsset } from "@/actions/enterprise/enterprise-management.actions";
import { useState, useRef } from "react";
import Image from "next/image";

export default function CoreIdentity({ logoUrl, onLogoChange }: CoreIdentityProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('assetType', 'logo');

            const result = await uploadOrganizationAsset(formData);

            if (result.error) throw new Error(result.error);
            if (result.data?.url) {
                onLogoChange(result.data.url);
                // Clear local preview as we now have the real URL
                setLocalPreview(null);
            }
        } catch (error: any) {
            console.error('Error uploading logo:', error);
            alert(error.message || "Failed to upload logo");
            setLocalPreview(null); // Clear preview on error
        } finally {
            setIsUploading(false);
        }

    };



    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                <Badge className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Core Identity</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company Logo</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group h-48 relative overflow-hidden"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                <p className="text-xs text-slate-500">Uploading...</p>
                            </div>
                        ) : (localPreview || logoUrl) ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={localPreview || logoUrl!}
                                    alt="Company Logo"
                                    fill
                                    className="object-contain p-2"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-xs font-bold">Change Logo</p>
                                </div>
                            </div>
                        ) : (

                            <>
                                <FileUp className="text-slate-400 group-hover:text-primary mb-3 size-8" />
                                <p className="text-xs text-slate-600 dark:text-slate-300 text-center font-bold mb-1">Click to Upload</p>
                                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
                                    PNG (Transparent)<br />
                                    Square (1:1 Ratio)<br />
                                    500px - 1000px<br />
                                    Max 2MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
