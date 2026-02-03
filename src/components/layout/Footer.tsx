import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                                P
                            </div>
                            <span className="font-bold text-lg text-foreground">
                                Priminent Vantage
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            We&apos;re on a mission to get motivated students into great jobs.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">For Students</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Short Courses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    All Job Simulations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Software Engineering
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Data Science
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Law
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">For Enterprise</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Enterprise Resources
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Request a Demo
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Case Studies
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Privacy Notice
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Terms of Use
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                        © 2026 Priminent Vantage, Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
