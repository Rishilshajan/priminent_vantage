import { StudentLogin } from "@/components/auth/StudentLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Priminent Vantage",
    description: "Log in to your account to continue your professional journey.",
};

export default function LoginPage() {
    return <StudentLogin />;
}
