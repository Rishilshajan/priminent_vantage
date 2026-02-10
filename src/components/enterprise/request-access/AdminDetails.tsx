import { ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";

interface AdminDetailsProps {
    register: UseFormRegister<any>;
}

export function AdminDetails({ register }: AdminDetailsProps) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-border">
                <ShieldAlert className="text-primary size-6" />
                <h3 className="text-xl font-bold text-foreground">Section 2: Primary Administrator Details</h3>
            </div>
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-primary">Helper Text:</span> This person will manage enterprise access, security policies, and user permissions for the entire organization.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Full Name *</label>
                    <Input
                        {...register("adminName", { required: true })}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="e.g. Sarah Jenkins"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Job Title *</label>
                    <Input
                        {...register("adminTitle", { required: true })}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="e.g. Head of Talent Acquisition"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Work Email (Domain-Locked) *</label>
                    <Input
                        {...register("adminEmail", { required: true })}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="s.jenkins@company.com"
                        type="email"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Business domain required</p>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Phone Number</label>
                    <Input
                        {...register("adminPhone")}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">LinkedIn Profile URL</label>
                    <Input
                        {...(() => {
                            const { onBlur, ...rest } = register("adminLinkedin");
                            return {
                                ...rest,
                                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                    let value = e.target.value;
                                    if (value && !/^https?:\/\//i.test(value)) {
                                        e.target.value = `https://${value}`;
                                    }
                                    onBlur(e);
                                }
                            }
                        })()}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="https://www.linkedin.com/in/username"
                        type="url"
                    />
                </div>
            </div>
        </section>
    );
}
