"use client"

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface CertificateData {
    student_name: string;
    simulation_title: string;
    certificate_id: string;
    issued_at: string;
    skills_acquired: string[];
    org_name: string;
    org_logo_url?: string;
    brandColor?: string;
    issuer_name?: string;
    issuer_title?: string;
    issuer_signature_url?: string;
    verification_url?: string;
}

export const generateCertificatePDF = async (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const brandColor = data.brandColor || "#4e2a84";

    // --- Helper: Add Image Safely ---
    const addImageFromUrl = async (url: string, x: number, y: number, w: number, h: number) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
            doc.addImage(base64, "PNG", x, y, w, h, undefined, 'FAST');
        } catch (e) {
            console.error("Failed to add image to PDF:", url, e);
        }
    };

    // --- Background & Border ---
    doc.setFillColor("#ffffff");
    doc.rect(0, 0, width, height, "F");

    // Premium Header Strip
    doc.setFillColor(brandColor);
    doc.rect(0, 0, width, 3, "F");

    // Outer border
    doc.setDrawColor(brandColor);
    doc.setLineWidth(1);
    doc.rect(5, 5, width - 10, height - 10);

    // Thin inner border
    doc.setDrawColor("#f3f4f6");
    doc.setLineWidth(0.2);
    doc.rect(8, 8, width - 16, height - 16);

    // --- Header: Branding ---
    // Vantage Logo (Placeholder/Icon)
    doc.setFillColor(brandColor);
    doc.roundedRect(15, 15, 8, 8, 1, 1, "F");
    doc.setTextColor("#ffffff");
    doc.setFontSize(5);
    doc.text("V", 18, 20.5, { align: "center" });

    doc.setTextColor(brandColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PRIMINENT VANTAGE", 25, 20);

    // Organization Logo
    if (data.org_logo_url) {
        await addImageFromUrl(data.org_logo_url, width - 35, 12, 20, 10);
    } else {
        doc.setTextColor("#94a3b8");
        doc.setFontSize(8);
        doc.text(data.org_name.toUpperCase(), width - 35, 18);
    }

    // --- Main Content ---
    doc.setTextColor("#1e293b");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.text("CERTIFICATE OF COMPLETION", width / 2, 50, { align: "center" });

    doc.setDrawColor(brandColor);
    doc.setLineWidth(1);
    doc.line(width / 2 - 15, 55, width / 2 + 15, 55);

    doc.setFontSize(14);
    doc.setTextColor("#64748b");
    doc.setFont("helvetica", "normal");
    doc.text("This certifies that", width / 2, 70, { align: "center" });

    // Student Name
    doc.setTextColor(brandColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.text(data.student_name, width / 2, 88, { align: "center" });

    // Description text
    doc.setTextColor("#64748b");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    const descriptionText = `Has successfully completed the professional simulation`;
    doc.text(descriptionText, width / 2, 100, { align: "center" });

    // Simulation Title
    doc.setTextColor("#1e293b");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(data.simulation_title, width / 2, 112, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("demonstrating professional excellence and industry readiness.", width / 2, 120, { align: "center" });

    // --- Footer: Signatures & Verification ---

    // Left: Vantage Signatory (A. Sterling)
    const sigY = 155;
    doc.setTextColor("#1e293b");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("A. STERLING", 50, sigY);
    doc.setFontSize(8);
    doc.setTextColor("#64748b");
    doc.text("CEO, PRIMINENT VANTAGE", 50, sigY + 4);
    doc.setDrawColor("#e2e8f0");
    doc.line(30, sigY - 2, 70, sigY - 2);

    // Right: Org Signatory
    doc.setTextColor("#1e293b");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text((data.issuer_name || "JAMES THOMPSON").toUpperCase(), width - 50, sigY, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor("#64748b");
    const issuerTitle = `${data.issuer_title || "HIRING DIRECTOR"}, ${data.org_name}`;
    doc.text(issuerTitle.toUpperCase(), width - 50, sigY + 4, { align: "center" });
    doc.setDrawColor("#e2e8f0");
    doc.line(width - 70, sigY - 2, width - 30, sigY - 2);

    // Signature Images
    if (data.issuer_signature_url) {
        await addImageFromUrl(data.issuer_signature_url, width - 65, sigY - 15, 30, 10);
    } else {
        doc.setTextColor("#1e293b");
        doc.setFont("courier", "italic");
        doc.setFontSize(14);
        doc.text(data.issuer_name || "James Thompson", width - 50, sigY - 8, { align: "center" });
    }

    // --- Bottom Bar: ID & QR Code ---
    doc.setDrawColor("#f3f4f6");
    doc.line(15, height - 25, width - 15, height - 25);

    doc.setTextColor("#94a3b8");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`CERTIFICATE ID: ${data.certificate_id}`, 20, height - 15);

    const formattedDate = new Date(data.issued_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    doc.text(`ISSUED ON: ${formattedDate}`, 20, height - 10);

    // QR Code for verification
    try {
        const qrContent = data.verification_url || `https://vantage-app.vercel.app/verify/${data.certificate_id}`;
        const qrDataUrl = await QRCode.toDataURL(qrContent, {
            margin: 0,
            color: {
                dark: brandColor,
                light: "#ffffff"
            }
        });
        doc.addImage(qrDataUrl, "PNG", width - 25, height - 26, 15, 15);
    } catch (e) {
        console.error("Failed to generate QR code:", e);
    }

    // Save and download
    doc.save(`Certificate-${data.student_name.replace(/\s+/g, '_')}.pdf`);
};
