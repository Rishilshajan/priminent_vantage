export function BrandSection() {
    const brands = [
        { name: "JP Morgan", font: "font-serif" },
        { name: "Goldman Sachs", font: "  er" },
        { name: "Red Bull", font: "italic" },
        { name: "BCG", font: "font-mono" },
        { name: "Walmart", font: "font-sans" },
        { name: "Citi", font: "tracking-wide" },
        { name: "Vanguard", font: "font-semibold" },
        { name: "Accenture", font: "font-light" },
        { name: "Pfizer", font: "  " },
    ];

    const marqueeBrands = [...brands, ...brands];

    return (
        <section className="py-12 border-y border-border bg-card overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <h3 className="text-lg font-bold text-foreground">
                    Trusted by Industry Leaders
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                    Get discovered by the teams hiring now.
                </p>
            </div>

            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-marquee">
                    {marqueeBrands.map((brand, index) => (
                        <div key={index} className="mx-8 flex items-center justify-center min-w-[150px]">
                            <span className={`text-2xl font-bold text-foreground/70 whitespace-nowrap ${brand.font}`}>
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
