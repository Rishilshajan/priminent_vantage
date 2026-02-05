import { ClipboardCheck } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface IntendedUseProps {
    register: UseFormRegister<any>;
}

export function IntendedUse({ register }: IntendedUseProps) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-border">
                <ClipboardCheck className="text-primary size-6" />
                <h3 className="text-xl font-bold text-foreground">Section 3: Intended Use</h3>
            </div>
            <div className="space-y-6">
                <label className="block text-sm font-semibold text-muted-foreground mb-4">Primary Objectives (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Note: React Hook Form works best with native inputs for simple constraints, 
                        wrapping UI Checkbox might require Controller but for simplicity using custom styled labels 
                        wrapping native checkbox or just using standard checkbox with custom styles.
                        For this specific design, standard checkbox inside label works well.
                    */}

                    {["Early talent screening", "Virtual job simulations", "Employer branding", "Campus hiring", "Diversity hiring"].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                value={item}
                                {...register("objectives")}
                                className="size-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium">{item}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Use Case Description (Optional)</label>
                    <textarea
                        {...register("useCase")}
                        className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 text-sm min-h-[120px]"
                        placeholder="Briefly describe your specific business intent..."
                    />
                </div>
            </div>
        </section>
    );
}
