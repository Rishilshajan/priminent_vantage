"use client"

import React from "react"
import Image from "next/image"
import { ExternalLink, Calendar, ShieldCheck, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificateCardProps {
    certificate: {
        id: string;
        certificate_id: string;
        simulation_title: string;
        student_name: string;
        issued_at: string;
        skills_acquired: string[];
        verification_url?: string;
        simulations?: {
            title: string;
            organizations: {
                name: string;
                logo_url: string;
            };
        };
    };
    brandColor?: string;
}

export function CertificateCard({ certificate, brandColor }: CertificateCardProps) {
    const brandColorStyle = brandColor ? { backgroundColor: brandColor } : {};
    const brandColorBorder = brandColor ? { borderColor: brandColor } : {};
    const brandColorText = brandColor ? { color: brandColor } : {};

    const orgName = certificate.simulations?.organizations?.name || "Global Partner";
    const orgLogo = certificate.simulations?.organizations?.logo_url || "/placeholder-company.png";
    const simTitle = certificate.simulations?.title || certificate.simulation_title;

    const formattedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#1b1427]/70 dark:shadow-none lg:rounded-[40px] lg:p-8">
  {/* subtle glow */}
  <div className="pointer-events-none absolute -top-28 -right-28 h-56 w-56 rounded-full bg-primary/12 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  {/* top accent */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />

  {/* Header */}
  <div className="relative mb-6 flex items-start justify-between lg:mb-8">
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative size-12 lg:size-14 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/70 dark:bg-white/5 dark:border-white/10 shadow-inner shrink-0">
        <Image src={orgLogo} alt={orgName} fill className="object-contain p-2" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
          Issued by
        </p>
        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
          {orgName}
        </p>
      </div>
    </div>

    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:border-emerald-500/25 dark:text-emerald-300">
      <ShieldCheck size={14} />
      Verified
    </span>
  </div>

  {/* Recipient */}
  <div className="relative mb-5">
    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 mb-2">
      Awarded to
    </p>

    <div className="flex items-start justify-between gap-4">
      <p className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
        {certificate.student_name}
      </p>

      {/* small mark */}
      <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-3 py-2">
        <span className="material-symbols-outlined text-[18px] text-primary">
          workspace_premium
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
          Certificate
        </span>
      </div>
    </div>
  </div>

  {/* Title */}
  <h3 className="relative mb-4 text-xl lg:text-2xl font-extrabold leading-snug text-slate-900 dark:text-white group-hover:text-primary transition-colors">
    {simTitle}
  </h3>

  {/* Skills — make it a clean list instead of pills */}
  {certificate.skills_acquired?.length ? (
    <div className="relative mb-6 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 overflow-hidden">
      {certificate.skills_acquired.slice(0, 3).map((skill, idx) => (
        <div
          key={idx}
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-3",
            idx !== 0 && "border-t border-slate-200/60 dark:border-white/10"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-9 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center shrink-0">
              <span className="material-symbols-outlined text-[16px] text-slate-700 dark:text-slate-200">
                check_circle
              </span>
            </div>
            <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {skill}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Skill
          </span>
        </div>
      ))}
    </div>
  ) : null}

  {/* Metadata */}
  <div className="relative mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        Issued Date
      </p>
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <div className="size-9 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center">
          <Calendar size={14} className="text-slate-700 dark:text-slate-200" />
        </div>
        <span>{formattedDate}</span>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        Credential ID
      </p>
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 grid place-items-center">
          <span className="material-symbols-outlined text-[16px] text-slate-700 dark:text-slate-200">
            fingerprint
          </span>
        </div>
        <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 break-all">
          {certificate.certificate_id}
        </span>
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="relative flex items-center gap-3">
    <button
      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-slate-900/15 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-95 dark:bg-white/10 dark:from-white/10 dark:to-white/10 dark:hover:bg-primary"
      style={brandColorStyle}
    >
      <Download size={16} className="lg:size-[18px]" />
      <span>Download</span>
    </button>

    <a
      href={certificate.verification_url || "#"}
      target="_blank"
      className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50/70 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
      title="Verify"
    >
      <ExternalLink size={18} className="lg:size-5" />
    </a>
  </div>
</div>
    )
}
