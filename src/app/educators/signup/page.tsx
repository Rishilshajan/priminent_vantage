import { EducatorSignUp } from "@/components/auth/EducatorSignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Educator Sign Up | Prominent Vantage",
    description: "Create your educator account to empower students with real-world experience and industry-backed simulations.",
    keywords: "educator signup, teacher registration, curriculum integration, student progress tracking, industry certification",
    openGraph: {
        title: "Educator Sign Up | Prominent Vantage",
        description: "Join thousands of educators who use Prominent Vantage to bridge the gap between the classroom and the workplace.",
        type: "website",
    },
};

export default function EducatorSignUpPage() {
    return <EducatorSignUp />;
}
