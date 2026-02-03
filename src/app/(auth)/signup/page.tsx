import { StudentSignUp } from "@/components/auth/StudentSignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Sign Up | Priminent Vantage",
    description: "Create your student account to access real-world career simulations.",
};

export default function StudentSignUpPage() {
    return <StudentSignUp />;
}
