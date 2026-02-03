export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary dark:bg-primary/20"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-primary to-primary"></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    Merit over Background. <br /> Skills over Connections.
                </h2>
                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                    We&apos;re building a world where candidates are hired for what they
                    can do. Start proving your potential today.
                </p>
                <button className="bg-white text-primary hover:bg-slate-50 font-bold text-lg px-10 py-4 rounded-xl shadow-xl transition-transform hover:-translate-y-1">
                    Enroll Now - It&apos;s Free
                </button>
            </div>
        </section>
    );
}
