"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { uploadProfileImageAction, updateStudentProfileAction } from "@/actions/student/student-profile.actions"
import {
    User,
    Mail,
    Phone,
    Award,
    Briefcase,
    GraduationCap,
    ShieldCheck,
    Globe,
    ExternalLink,
    Menu,
    X,
    Check,
    MapPin,
    Github,
    Linkedin,
    Layers,
    Pencil,
    LayoutDashboard,
    PieChart,
    Languages,
    Star,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SkillBadge } from "@/components/student/SkillBadge"
import { CertificateCard } from "@/components/student/CertificateCard"
import { ExperienceCard } from "@/components/student/ExperienceCard"
import { EducationCard } from "@/components/student/EducationCard"
import { StudentSidebar } from "./StudentSidebar"
import { NotificationDropdown } from "./NotificationDropdown"

interface StudentSettingsViewProps {
    data: {
        profile: any;
        skills: any[];
        certificates: any[];
        experience: any[];
        education: any[];
    };
    organizationBranding?: any;
}

type TabType = 'overview' | 'experience' | 'education' | 'skills' | 'projects' | 'achievements' | 'languages';

export function StudentSettingsView({ data, organizationBranding }: StudentSettingsViewProps) {
    const { profile, skills, certificates, experience, education } = data;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [uploading, setUploading] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [loadingField, setLoadingField] = useState<string | null>(null);

    // Bulk Editing States
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [bulkContactData, setBulkContactData] = useState({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        highest_education_level: profile.highest_education_level || "",
        phone_number: profile.phone_number || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        city: profile.city || "",
        country: profile.country || ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const brandColor = organizationBranding?.primary_color || "#3b82f6";
    const brandColorStyle = { backgroundColor: brandColor };
    const brandColorText = { color: brandColor };

    const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Student Name";
    const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadProfileImageAction(formData);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.error || "Failed to upload image.");
            }
        } catch (err) {
            console.error("Upload handler error:", err);
            alert("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const startEditing = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value || "");
    };

    const cancelEditing = () => {
        setEditingField(null);
        setEditValue("");
    };

    const handleUpdate = async (field: string) => {
        setLoadingField(field);
        try {
            // Map common field names to DB column names if necessary
            const params: any = {};
            if (field === 'name') {
                const parts = editValue.trim().split(/\s+/);
                params.first_name = parts[0] || "";
                params.last_name = parts.slice(1).join(" ") || "";
            } else if (field === 'location') {
                const parts = editValue.split(',').map(p => p.trim());
                params.city = parts[0] || "";
                params.country = parts[1] || "";
            } else {
                params[field] = editValue;
            }

            const res = await updateStudentProfileAction(params);
            if (res.success) {
                router.refresh();
                setEditingField(null);
            } else {
                alert(res.error || "Update failed.");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred.");
        } finally {
            setLoadingField(null);
        }
    };

    const handleBulkSave = async () => {
        setLoadingField('bulk_contact');
        try {
            const res = await updateStudentProfileAction({
                ...bulkContactData
            });
            if (res.success) {
                router.refresh();
                setIsBulkEditing(false);
            } else {
                alert(res.error || "Bulk update failed.");
            }
        } catch (err) {
            console.error("Bulk update error:", err);
            alert("An error occurred during bulk save.");
        } finally {
            setLoadingField(null);
        }
    };

    const toggleBulkEdit = () => {
        if (!isBulkEditing) {
            // Initialize with current values
            setBulkContactData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                highest_education_level: profile.highest_education_level || "",
                phone_number: profile.phone_number || "",
                linkedin_url: profile.linkedin_url || "",
                github_url: profile.github_url || "",
                city: profile.city || "",
                country: profile.country || ""
            });
        }
        setIsBulkEditing(!isBulkEditing);
    };

    // Calculate experience years roughly
    const experienceYears = experience.length > 0 ? "1 year of experience" : "Fresher";

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Award },
        { id: 'projects', label: 'Projects', icon: Layers },
        { id: 'achievements', label: 'Achievements', icon: Star },
        { id: 'languages', label: 'Languages', icon: Languages },
    ];

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-background-dark font-display">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.01]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-white/80 px-4 backdrop-blur-md dark:bg-[#1e1429]/80 lg:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-main dark:text-white"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex items-center gap-3">
                    <NotificationDropdown brandColor={brandColor} />
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-text-main dark:text-white">Vantage</span>
                        <div className="flex size-9 items-center justify-center rounded bg-primary text-white font-black text-xs" style={brandColorStyle}>PV</div>
                    </div>
                </div>
            </div>

            <StudentSidebar
                user={profile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 p-6 pb-20 lg:p-10">

                    {/* Top Profile Banner (New Redesign) */}
                    <div className="relative overflow-hidden rounded-[40px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:bg-[#1e1429] dark:shadow-none lg:p-12">
                        <div className="absolute right-8 top-8 hidden lg:block">
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
                            {/* Mobile-only Profile Strength */}
                            <div className="flex w-full justify-center lg:hidden">
                                <div className="rounded-full bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 dark:bg-red-500/10 dark:text-red-400">
                                    Profile Strength: 45%
                                </div>
                            </div>
                            {/* Left Section: Avatar & Socials */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="relative size-28 overflow-hidden rounded-full border-[5px] border-slate-50 shadow-inner dark:border-white/5 lg:size-40">
                                        <Image
                                            src={avatarUrl}
                                            alt={fullName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-2 flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-lg dark:bg-slate-800 lg:size-12">
                                        {uploading ? (
                                            <Loader2 size={20} className="animate-spin text-primary" style={brandColorText} />
                                        ) : (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex h-full w-full items-center justify-center"
                                            >
                                                <Pencil size={20} className="text-primary" style={brandColorText} />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>


                            </div>

                            {/* Middle Section: Main Info */}
                            <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
                                <div className="flex flex-col items-center gap-2 lg:items-start">
                                    <div className="flex items-center gap-4">
                                        {isBulkEditing ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={bulkContactData.first_name}
                                                    onChange={(e) => setBulkContactData({ ...bulkContactData, first_name: e.target.value })}
                                                    placeholder="First Name"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-1 text-2xl font-black focus:border-primary focus:outline-none dark:bg-[#1e1429] dark:border-white/10"
                                                />
                                                <input
                                                    type="text"
                                                    value={bulkContactData.last_name}
                                                    onChange={(e) => setBulkContactData({ ...bulkContactData, last_name: e.target.value })}
                                                    placeholder="Last Name"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-1 text-2xl font-black focus:border-primary focus:outline-none dark:bg-[#1e1429] dark:border-white/10"
                                                />
                                            </div>
                                        ) : editingField === 'name' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-1 text-2xl font-black focus:border-primary focus:outline-none dark:bg-[#1e1429] dark:border-white/10"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdate('name')} className="text-green-500 hover:scale-110 transition-transform">
                                                    {loadingField === 'name' ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                                                </button>
                                                <button onClick={cancelEditing} className="text-red-500 hover:scale-110 transition-transform">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl font-black    text-slate-900 dark:text-white lg:text-3xl">
                                                    {fullName}
                                                </h1>
                                                <button onClick={() => startEditing('name', fullName)} className="text-slate-300 hover:text-primary transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {isBulkEditing ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={bulkContactData.highest_education_level}
                                                onChange={(e) => setBulkContactData({ ...bulkContactData, highest_education_level: e.target.value })}
                                                className="rounded-lg border border-slate-200 px-3 py-1 text-base font-bold focus:border-primary focus:outline-none dark:bg-[#1e1429] dark:border-white/10"
                                                placeholder="Highest Education"
                                            />
                                        </div>
                                    ) : editingField === 'highest_education_level' ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-1 text-base font-bold focus:border-primary focus:outline-none dark:bg-[#1e1429] dark:border-white/10"
                                                autoFocus
                                            />
                                            <button onClick={() => handleUpdate('highest_education_level')} className="text-green-500">
                                                {loadingField === 'highest_education_level' ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                            </button>
                                            <button onClick={cancelEditing} className="text-red-500">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-bold text-slate-900 dark:text-white">
                                                {profile.highest_education_level || "Student"}
                                            </p>
                                            <button onClick={() => startEditing('highest_education_level', profile.highest_education_level || "")} className="text-slate-200 hover:text-primary transition-colors">
                                                <Pencil size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs font-bold text-primary" style={brandColorText}>
                                        <Globe size={14} />
                                        <span>{experienceYears}</span>
                                    </div>

                                    {isBulkEditing ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={bulkContactData.city}
                                                onChange={(e) => setBulkContactData({ ...bulkContactData, city: e.target.value })}
                                                placeholder="City"
                                                className="w-24 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold focus:border-primary focus:outline-none dark:bg-white/5 dark:border-white/10"
                                            />
                                            <input
                                                type="text"
                                                value={bulkContactData.country}
                                                onChange={(e) => setBulkContactData({ ...bulkContactData, country: e.target.value })}
                                                placeholder="Country"
                                                className="w-24 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold focus:border-primary focus:outline-none dark:bg-white/5 dark:border-white/10"
                                            />
                                        </div>
                                    ) : editingField === 'location' ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                placeholder="City, Country"
                                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold focus:border-primary focus:outline-none dark:bg-white/5 dark:border-white/10"
                                                autoFocus
                                            />
                                            <button onClick={() => handleUpdate('location')} className="text-green-500">
                                                {loadingField === 'location' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                            </button>
                                            <button onClick={cancelEditing} className="text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEditing('location', `${profile.city || ""}, ${profile.country || ""}`)}
                                            className="mt-1 flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-all hover:bg-white dark:border-white/5 dark:bg-white/5 lg:w-fit"
                                        >
                                            <MapPin size={14} className="text-primary" style={brandColorText} />
                                            {profile.city || "City"}, {profile.country || "Country"}
                                            <Pencil size={10} className="ml-1 text-slate-200" />
                                        </button>
                                    )}
                                </div>

                                {/* Contact Details Boxes */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-primary/30 dark:border-white/10">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                                            <Mail size={16} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{profile.email}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</span>
                                        </div>
                                    </div>
                                    <div className="group relative flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-primary/30 dark:border-white/10">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                                            <Phone size={16} />
                                        </div>
                                        <div className="flex flex-1 flex-col min-w-0">
                                            {isBulkEditing ? (
                                                <input
                                                    type="text"
                                                    value={bulkContactData.phone_number}
                                                    onChange={(e) => setBulkContactData({ ...bulkContactData, phone_number: e.target.value })}
                                                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none focus:ring-0 placeholder:text-slate-300"
                                                    placeholder="Phone Number"
                                                    autoFocus
                                                />
                                            ) : editingField === 'phone_number' ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-full bg-transparent text-[11px] font-bold focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdate('phone_number')} className="text-green-500">
                                                        {loadingField === 'phone_number' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{profile.phone_number || "Add Phone"}</span>
                                                    <button onClick={() => startEditing('phone_number', profile.phone_number || "")} className="opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Pencil size={10} className="text-slate-300 hover:text-primary" />
                                                    </button>
                                                </div>
                                            )}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phone</span>
                                        </div>
                                    </div>

                                    {/* LinkedIn Card */}
                                    <div className="group relative flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-primary/30 dark:border-white/10">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                                            <Linkedin size={16} />
                                        </div>
                                        <div className="flex flex-1 flex-col min-w-0">
                                            {isBulkEditing ? (
                                                <input
                                                    type="text"
                                                    value={bulkContactData.linkedin_url}
                                                    onChange={(e) => setBulkContactData({ ...bulkContactData, linkedin_url: e.target.value })}
                                                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none focus:ring-0 placeholder:text-slate-300"
                                                    placeholder="LinkedIn URL"
                                                />
                                            ) : editingField === 'linkedin_url' ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        placeholder="URL"
                                                        className="w-full bg-transparent text-[11px] font-bold focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdate('linkedin_url')} className="text-green-500">
                                                        {loadingField === 'linkedin_url' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    {profile.linkedin_url ? (
                                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-slate-900 dark:text-white truncate hover:text-primary">LinkedIn Profile</a>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-slate-400">Not Added</span>
                                                    )}
                                                    <button onClick={() => startEditing('linkedin_url', profile.linkedin_url || "")} className="opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Pencil size={10} className="text-slate-300 hover:text-primary" />
                                                    </button>
                                                </div>
                                            )}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">LinkedIn</span>
                                        </div>
                                    </div>

                                    {/* GitHub Card */}
                                    <div className="group relative flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-primary/30 dark:border-white/10">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                                            <Github size={16} />
                                        </div>
                                        <div className="flex flex-1 flex-col min-w-0">
                                            {isBulkEditing ? (
                                                <input
                                                    type="text"
                                                    value={bulkContactData.github_url}
                                                    onChange={(e) => setBulkContactData({ ...bulkContactData, github_url: e.target.value })}
                                                    className="w-full bg-transparent text-[11px] font-bold focus:outline-none focus:ring-0 placeholder:text-slate-300"
                                                    placeholder="GitHub URL"
                                                />
                                            ) : editingField === 'github_url' ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        placeholder="URL"
                                                        className="w-full bg-transparent text-[11px] font-bold focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdate('github_url')} className="text-green-500">
                                                        {loadingField === 'github_url' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    {profile.github_url ? (
                                                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-slate-900 dark:text-white truncate hover:text-primary">GitHub Profile</a>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-slate-400">Not Added</span>
                                                    )}
                                                    <button onClick={() => startEditing('github_url', profile.github_url || "")} className="opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Pencil size={10} className="text-slate-300 hover:text-primary" />
                                                    </button>
                                                </div>
                                            )}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">GitHub</span>
                                        </div>
                                    </div>
                                </div>

                                {isBulkEditing ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleBulkSave}
                                            disabled={loadingField === 'bulk_contact'}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                                            style={brandColorStyle}
                                        >
                                            {loadingField === 'bulk_contact' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                            <span>Save Changes</span>
                                        </button>
                                        <button
                                            onClick={() => setIsBulkEditing(false)}
                                            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:bg-slate-50 active:scale-95 dark:border-white/10"
                                        >
                                            <X size={14} />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleBulkEdit}
                                        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-50 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/5 active:scale-95 dark:border-white/5"
                                        style={brandColorText}
                                    >
                                        <Pencil size={14} />
                                        <span>Edit Contact Info</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto rounded-[32px] bg-white p-2 shadow-xl shadow-slate-200/30 dark:bg-[#1e1429] dark:shadow-none lg:gap-4 no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-2xl px-6 py-4 text-xs font-bold transition-all whitespace-nowrap lg:py-4.5",
                                        isActive
                                            ? "bg-primary text-white shadow-xl shadow-primary/30"
                                            : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
                                    )}
                                    style={isActive ? brandColorStyle : {}}
                                >
                                    <Icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab Content Rendering */}
                    <div className="flex flex-col gap-10">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                                {/* Profile Summary Card */}
                                <div className="flex flex-col gap-6 lg:col-span-2">
                                    <div className="flex flex-col gap-8 rounded-[40px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:bg-[#1e1429] dark:shadow-none lg:p-12">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white" style={brandColorStyle}>
                                                <PieChart size={20} />
                                            </div>
                                            <h2 className="text-2xl font-black    text-slate-900 dark:text-white">Profile Summary</h2>
                                        </div>

                                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{fullName}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{experienceYears}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{profile.city || "Idukki"}, {profile.country || "IN"}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Strength</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">45%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-8 dark:border-white/5">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Professional Summary</span>
                                                <button className="text-slate-300 hover:text-primary">
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                            <p className="text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                                {profile.highest_education_level || "Student"} with a passion for learning and career growth through practical simulations.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats Card */}
                                <div className="flex flex-col gap-8 rounded-[40px] bg-white p-8 shadow-2xl shadow-slate-200/40 dark:bg-[#1e1429] dark:shadow-none lg:p-12 lg:col-span-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white" style={brandColorStyle}>
                                            <Layers size={20} />
                                        </div>
                                        <h2 className="text-2xl font-black    text-slate-900 dark:text-white">Quick Stats</h2>
                                    </div>

                                    <div className="flex flex-col gap-8">
                                        {[
                                            { label: 'Work Experiences', value: experience.length },
                                            { label: 'Skills', value: skills.length },
                                            { label: 'Awards', value: 0 },
                                            { label: 'Education', value: education.length },
                                            { label: 'Projects', value: 0 }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                <span className="text-4xl font-black text-primary" style={brandColorText}>{stat.value}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black    text-slate-900 dark:text-white px-2">Professional Skills</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {skills.length > 0 ? (
                                        skills.map((skill, idx) => (
                                            <SkillBadge key={idx} skill={skill} brandColor={brandColor} />
                                        ))
                                    ) : (
                                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 dark:border-white/10 dark:bg-[#1e1429] col-span-full">
                                            <p className="text-sm font-medium text-slate-400">No skills added to your profile yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black    text-slate-900 dark:text-white px-2">Professional Journey</h2>
                                <div className="flex flex-col gap-4">
                                    {experience.length > 0 ? (
                                        experience.map((exp) => (
                                            <ExperienceCard key={exp.id} experience={exp} brandColor={brandColor} />
                                        ))
                                    ) : (
                                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 dark:border-white/10 dark:bg-[#1e1429]">
                                            <p className="text-sm font-medium text-slate-400">No professional experience listed.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black    text-slate-900 dark:text-white px-2">Academic Background</h2>
                                <div className="flex flex-col gap-4">
                                    {education.length > 0 ? (
                                        education.map((edu) => (
                                            <EducationCard key={edu.id} education={edu} brandColor={brandColor} />
                                        ))
                                    ) : (
                                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 dark:border-white/10 dark:bg-[#1e1429]">
                                            <p className="text-sm font-medium text-slate-400">No education details listed.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {(activeTab === 'projects' || activeTab === 'achievements' || activeTab === 'languages') && (
                            <div className="flex flex-col items-center justify-center gap-6 rounded-[40px] bg-white p-20 shadow-xl dark:bg-[#1e1429] animate-in fade-in duration-500">
                                <div className="flex size-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-white/5">
                                    <PieChart size={40} className="text-slate-300" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Coming Soon</h2>
                                <p className="text-sm font-medium text-slate-400">This section is currently under development.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
