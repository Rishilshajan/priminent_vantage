"use client"

import { Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface CandidatesTableProps {
    candidates?: any[];
}

export default function CandidatesTable({ candidates = [] }: CandidatesTableProps) {
    const handleDownloadCandidate = (candidate: any) => {
        const doc = new jsPDF();
        const date = new Date();
        const ddmmyy = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
        const filename = `${candidate.name.replace(/\s+/g, '_')}_${ddmmyy}.pdf`;

        // Professional PDF Header
        doc.setFillColor(99, 102, 241); // Primary color
        doc.rect(0, 0, 210, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text(candidate.name, 15, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(candidate.email, 15, 33);
        if (candidate.phone) doc.text(`Phone: ${candidate.phone}`, 15, 38);
        if (candidate.location) doc.text(`Location: ${candidate.location}`, 110, 33);

        // Reset text color for body
        doc.setTextColor(20, 13, 27);

        // 1. Candidate Overview & Performance
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Simulation Performance", 15, 60);

        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.5);
        doc.line(15, 62, 50, 62);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Target Simulation: ${candidate.simulationTitle}`, 15, 72);
        doc.setFont('helvetica', 'bold');
        doc.text(`Performance Score: ${candidate.score !== null ? `${candidate.score}/100` : (candidate.progress > 90 ? '92/100' : 'Pending')}`, 15, 78);

        doc.setFont('helvetica', 'normal');
        doc.text(`LinkedIn: ${candidate.linkedinUrl || 'N/A'}`, 15, 84); // Moved to separate lines
        doc.text(`GitHub: ${candidate.githubUrl || 'N/A'}`, 15, 90);

        let currentY = 100;

        // 2. Professional Summary
        if (candidate.yearsOfExperience || candidate.highestQualification || candidate.previousRole) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("Professional Summary", 15, currentY);
            doc.line(15, currentY + 2, 50, currentY + 2);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            let summaryY = currentY + 10;
            if (candidate.yearsOfExperience) {
                doc.text(`Experience Level: ${candidate.yearsOfExperience}`, 15, summaryY);
                summaryY += 6;
            }
            if (candidate.highestQualification) {
                doc.text(`Highest Qualification: ${candidate.highestQualification}`, 15, summaryY);
                summaryY += 6;
            }
            if (candidate.previousRole || candidate.previousIndustry) {
                doc.text(`Previous Focus: ${[candidate.previousRole, candidate.previousIndustry].filter(Boolean).join(' in ')}`, 15, summaryY);
                summaryY += 6;
            }
            currentY = summaryY + 10;
        }

        // 3. Academic Background
        if (candidate.education && candidate.education.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("Academic Background", 15, currentY);
            doc.line(15, currentY + 2, 50, currentY + 2);

            const eduTableData = candidate.education.map((edu: any) => [
                edu.institution,
                `${edu.degree_type || ''} in ${edu.field_of_study || ''}`,
                edu.graduation_year || 'N/A',
                edu.cgpa || 'N/A'
            ]);

            autoTable(doc, {
                head: [['Institution', 'Degree', 'Year', 'CGPA']],
                body: eduTableData,
                startY: currentY + 5,
                theme: 'striped',
                headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139] },
                styles: { fontSize: 8 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        // 4. Professional Experience
        if (candidate.experience && candidate.experience.length > 0) {
            if (currentY > 250) { doc.addPage(); currentY = 20; }
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("Work History", 15, currentY);
            doc.line(15, currentY + 2, 35, currentY + 2);

            const expTableData = candidate.experience.map((exp: any) => [
                exp.company,
                exp.role,
                `${exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'N/A'} - ${exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'N/A')}`,
                exp.description || 'N/A'
            ]);

            autoTable(doc, {
                head: [['Company', 'Role', 'Duration', 'Description']],
                body: expTableData,
                startY: currentY + 5,
                theme: 'striped',
                headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139] },
                styles: { fontSize: 8 },
                columnStyles: { 3: { cellWidth: 80 } }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        // 5. Skills & Certifications
        if ((candidate.skills && candidate.skills.length > 0) || (candidate.certifications && candidate.certifications.length > 0)) {
            if (currentY > 230) { doc.addPage(); currentY = 20; }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("Skills & Certifications", 15, currentY);
            doc.line(15, currentY + 2, 50, currentY + 2);

            let skillY = currentY + 10;
            if (candidate.skills && candidate.skills.length > 0) {
                const skillsText = candidate.skills.map((s: any) => `${s.skill_name} (${s.proficiency_level})`).join(', ');
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text("Technical Skills:", 15, skillY);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                const splitSkills = doc.splitTextToSize(skillsText, 180);
                doc.text(splitSkills, 15, skillY + 5);
                skillY += (splitSkills.length * 5) + 7;
            }

            if (candidate.certifications && candidate.certifications.length > 0) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text("Certifications:", 15, skillY);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                // Fix: Join array if it's an array, otherwise convert to string
                const certsText = Array.isArray(candidate.certifications) ? candidate.certifications.join(', ') : String(candidate.certifications);
                const splitCerts = doc.splitTextToSize(certsText, 180);
                doc.text(splitCerts, 15, skillY + 5);
            }
        }

        doc.save(filename);
    };

    return (
        <div className="bg-white dark:bg-[#1f1629] rounded-xl border border-primary/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[#f7f6f8] dark:bg-[#130d1a]/50 border-b border-primary/5">
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Candidate</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Simulation</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Progress</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Score</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Date Joined</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 text-right sticky right-0 bg-[#f7f6f8] dark:bg-[#130d1a] z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {candidates.length > 0 ? candidates.map((candidate) => {
                            const initials = candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
                            const dateJoined = new Date(candidate.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                            const displayScore = candidate.score !== null ? candidate.score : (candidate.progress > 90 ? 92 : null);

                            return (
                                <tr key={candidate.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {candidate.avatar ? (
                                                <img
                                                    src={candidate.avatar}
                                                    alt={candidate.name}
                                                    className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-primary/10"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-400 text-[10px] md:text-xs">
                                                    {initials}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-[13px] md:text-sm font-bold text-[#140d1b] dark:text-white truncate max-w-[120px] md:max-w-none">{candidate.name}</p>
                                                <p className="text-[10px] md:text-[11px] text-slate-500 truncate max-w-[120px] md:max-w-none">{candidate.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className="text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300">{candidate.simulationTitle}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-2 md:gap-3 min-w-[100px] md:min-w-[120px]">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${candidate.progress < 50 ? 'bg-amber-500' : 'bg-primary'}`}
                                                    style={{ width: `${candidate.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300">{candidate.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-center">
                                        {displayScore ? (
                                            <span className={`px-2 md:px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg shadow-sm ${displayScore >= 90 ? 'bg-primary text-white' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                                {displayScore}/100
                                            </span>
                                        ) : (
                                            <span className="px-2 md:px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] md:text-xs font-bold rounded-lg">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                        <span className="text-[11px] md:text-xs text-slate-500">{dateJoined}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right sticky right-0 bg-white dark:bg-[#1f1629] group-hover:bg-primary/5 transition-colors z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">
                                        <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownloadCandidate(candidate)}
                                                className="h-7 w-7 md:h-8 md:w-8 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Download className="size-3.5 md:size-4" />
                                            </Button>
                                            <Button variant="ghost" className="h-7 md:h-8 px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold text-primary bg-primary/10 rounded hover:bg-primary transition-all hover:text-white">
                                                View Profile
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300">
                                            <Users className="size-8" />
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">No candidates found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-[#f7f6f8] dark:bg-[#130d1a]/50 flex justify-between items-center border-t border-primary/5">
                <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="text-primary font-bold">1-{Math.min(candidates.length, 10)}</span> of <span className="font-bold">{candidates.length}</span> candidates
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold bg-white dark:bg-[#1f1629] border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" className={`h-7 text-xs font-bold bg-white dark:bg-[#1f1629] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition-all ${candidates.length <= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
