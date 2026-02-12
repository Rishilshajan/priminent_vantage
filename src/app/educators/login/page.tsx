import { EducatorLogin } from "@/components/auth/EducatorLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Educator Login | Prominent Vantage",
    description: "Log in to your educator account to manage curriculum, track student progress, and access industry-backed simulations.",
    keywords: "educator login, teacher login, curriculum management, student analytics",
    openGraph: {
        title: "Educator Login | Prominent Vantage",
        description: "Access your educator dashboard to empower your students with real-world experience.",
        type: "website",
    },
};

export default function EducatorLoginPage() {
    return <EducatorLogin />;
}
