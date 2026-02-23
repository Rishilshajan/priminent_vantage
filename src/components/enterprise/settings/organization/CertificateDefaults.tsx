"use client"

import { Award, Upload } from "lucide-react"
import { uploadOrganizationAsset } from "@/actions/enterprise";
import { useState, useRef } from "react";
import Image from "next/image";

interface CertificateDefaultsProps {
    directorName?: string;
    directorTitle?: string;
    signatureUrl?: string | null;
    onDirectorNameChange: (text: string) => void;
    onDirectorTitleChange: (text: string) => void;
    onSignatureChange: (url: string) => void;
}

export default function CertificateDefaults({
    directorName = "Helena Richards",
    directorTitle = "Chief People Officer",
    signatureUrl,
    onDirectorNameChange,
    onDirectorTitleChange,
    onSignatureChange
}: CertificateDefaultsProps) {
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
            formData.append('assetType', 'signature');

            const result = await uploadOrganizationAsset(formData);

            if (result.error) throw new Error(result.error);
            if (result.data?.url) {
                onSignatureChange(result.data.url);
                // Clear local preview as we now have the real URL
                setLocalPreview(null);
            }
        } catch (error: any) {
            console.error('Error uploading signature:', error);
            alert(error.message || "Failed to upload signature");
            setLocalPreview(null); // Clear preview on error
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <section className="bg-white dark:bg-[#1f1629] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20 rounded-t-xl">
                <Award className="text-primary size-6" />
                <h2 className="font-bold text-slate-900 dark:text-white">Certificate Defaults</h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Default Signatory Name</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                type="text"
                                value={directorName || ""}
                                onChange={(e) => onDirectorNameChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Signatory Title</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                type="text"
                                value={directorTitle || ""}
                                onChange={(e) => onDirectorTitleChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Digital Signature</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg"
                                    onChange={handleUpload}
                                    disabled={isUploading}
                                />
                                <Upload className="size-4 text-slate-400" />
                                <span className="text-sm text-slate-500 font-medium">
                                    {isUploading ? "Uploading..." : "Upload Signature Image"}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1.5">Upload a transparent PNG of the signature.</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 relative flex flex-col items-center justify-center min-h-[200px]">
                        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</div>

                        <p className="font-display font-bold text-slate-800 dark:text-white text-lg">{directorName}</p>
                        <p className="text-sm text-slate-500 mb-4">{directorTitle}</p>

                        <div className="w-32 h-0.5 bg-slate-200 dark:bg-slate-700 mb-4"></div>

                        {(localPreview || signatureUrl) ? (
                            <div className="relative w-32 h-16">
                                <Image
                                    src={localPreview || signatureUrl!}
                                    alt="Signature"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-16 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center rounded">
                                <p className="text-[10px] text-slate-400">Signature</p>
                            </div>
                        )}

                        <div className="mt-6 border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Official Seal</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
