import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormRegister, Control, Controller, FieldErrors } from "react-hook-form";
import { CountrySelect } from "@/components/ui/country-select";

// Define interface for form data to ensure type safety
interface CompanyDetailsProps {
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: FieldErrors<any>;
}

export function CompanyDetails({ register, control, errors }: CompanyDetailsProps) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-border">
                <Building2 className="text-primary size-6" />
                <h3 className="text-xl font-bold text-foreground">Section 1: Company Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Legal Entity Name *</label>
                    <Input
                        {...register("companyName", { required: true })}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="e.g. Priminent Solutions Pvt Ltd"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Country of Registration *</label>
                    <Controller
                        name="country"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <CountrySelect
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.country}
                            />
                        )}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Company Website *</label>
                    <Input
                        {...(() => {
                            const { onBlur, ...rest } = register("website", { required: true });
                            return {
                                ...rest,
                                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                    const value = e.target.value;
                                    if (value) {
                                        // Strip existing protocols and redundant www
                                        const clean = value.replace(/(https?:\/\/)+/g, "").replace(/^www\./, "").trim();
                                        e.target.value = `https://${clean}`;
                                    }
                                    onBlur(e);
                                }
                            }
                        })()}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="https://www.company.com"
                        type="url"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Industry *</label>
                    <select
                        {...register("industry", { required: true })}
                        className="w-full h-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary px-4 text-sm"
                    >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology & SaaS</option>
                        <option value="finance">Finance & Banking</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Company Size *</label>
                    <select
                        {...register("companySize", { required: true })}
                        className="w-full h-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary px-4 text-sm"
                    >
                        <option value="">Select Size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000-5000">1000-5000 employees</option>
                        <option value="5000+">5000+ employees</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Company Registration Number *</label>
                    <Input
                        {...register("registrationNumber", { required: true })}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="CRN / VAT / Tax ID"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Headquarters Location</label>
                    <Input
                        {...register("hqLocation")}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="City, State"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Hiring Regions</label>
                    <Input
                        {...register("hiringRegions")}
                        className="w-full h-12 rounded-lg bg-background focus-visible:ring-primary px-4"
                        placeholder="e.g. North America, EMEA, APAC"
                    />
                </div>
            </div>
        </section>
    );
}
