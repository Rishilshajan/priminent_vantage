import { ArrowRight, Clock, BarChart, CheckCircle, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const simulations = [
    {
        title: "Software Engineering Virtual Experience",
        company: "JP Morgan Chase & Co.",
        description: "Learn to code and build software solutions for a global bank. Master the basics of backend development and data structures.",
        duration: "5-6 hours",
        level: "Intermediate",
        color: "bg-white",
        tag: "ENGINEERING",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYzhU5IidgHmqNESZCrGougbeXXrghio3Ki-lXtc4WJu6iDHEb0LyiiY_UeVTcLSoxyBNDwaQ_BG8FdZmi5WhDq1ZsTgYwvRC79Ek2sCKWXuF2wR2BK-g02w3kWFG71yFCVZ1FA9HkDEbl39wsrJG0W79Hk79b_tmyBwOI_TGg8ZtI1-kTigDIqDnO_qF7staeLUGHD_1V0ZnZfjGpZSyTFf9CrZzYIFRrvfBk1CSYpiySGp5FOtYiU6AVrmWD-rC_zk9FGcLv_UU"
    },
    {
        title: "Investment Banking Virtual Reality",
        company: "Citi",
        description: "Analyze markets and assist clients with mergers and acquisitions. Get an inside look at how M&A deals are structured.",
        duration: "4-5 hours",
        level: "Advanced",
        color: "bg-white",
        tag: "FINANCE",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbO_Pce_Y0dudp3vq9uamevxHRWSZyW8daiCIjhnmUYq_8wjGp0NKlz3wZbdAL4aj7_arI_Fbez3zyBdhBUiKA6083W411JWeASEpvHL89CSMxYSYlO6wU16coqzkwEmB5ucWijcVakTjZIc5NFbLrsOwgnZyqMJxb5ePQSDbiveYZVBkM8HaFs9fqBerHa5gZkA1C-UVsVc0e2xEpOsCKNgqZamOO-HxQjh_VJo-dC3KX74ONqjOqpyxJzc53meuBWACczCnHaSHg"
    },
    {
        title: "Strategy Consulting Initiative",
        company: "BCG",
        description: "Help a telecommunications client launch a 5G network. Develop strategic frameworks and present your findings.",
        duration: "6-7 hours",
        level: "Beginner",
        color: "bg-white",
        tag: "CONSULTING",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrnNucgyf2TaWQ8ZMkZPY26-t4chijs79Ml-gp1gxOI8cntwXPMwTJcsLSUwjz8HeDJrWiEhtWoMTntlIxDFbGAWPQH9uq9B8totuJ8xsuCaVmybPoWMByBUQJMBWb10qFYyxBPRKIzeoe7VH_C6m4Ods09QoiZmS2UjfoTJEiMDnPS2vfxftgyv77PIANF2-A89IhZ6zliSrPDJTwl3kAQlIzNMqYzF_uJIY_vkt70oRWJr3MfFh29H-dEpwmGdtwEWOqx8Z7rfY"
    },
    {
        title: "Sales & Marketing Masterclass",
        company: "Red Bull",
        description: "Discover the dynamic world of sales and trade marketing. Plan a product launch and analyze market data.",
        duration: "2-3 hours",
        level: "Beginner",
        color: "bg-white",
        tag: "MARKETING",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5-CrffhqXowAQkXHfNQuCX0yzN82lqwUAOm4-szHsWGaBD8Q7Vd2EN31aqw3Q7s2d1JGjNveht-qd1AgRD23zfiCM3RSEDzt3LPt_OWgOhiaoexzFbOE6GQR_uUvw1UkEbfpgKc0fVxCK80I-3g0gOwWBUoHyaJbAFT-uunA6XjyliqCzFYwyWRDl5inpL-IylB6otEOi-3tLgPrnvfQ8euK3UOfFCAp3une8wKrHQep8_39HtlrDQjYsh3UFYypVbDfs3eibj7A"
    }
];

export function FeaturedSimulations() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                            Career Tracks
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Featured Job Simulations
                        </h2>
                    </div>
                    <Link
                        href="#"
                        className="hidden md:flex items-center font-semibold text-primary hover:text-primary/80 transition-colors mt-4 md:mt-0"
                    >
                        View catalog <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {simulations.map((sim, index) => (
                        <div
                            key={index}
                            className="group relative bg-card rounded-2xl p-2 shadow-sm hover:shadow-xl transition-all duration-300 border border-border overflow-hidden flex flex-col md:flex-row"
                        >
                            <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto relative overflow-hidden rounded-xl">
                                {/* Using standard img tag with referrerPolicy as requested images are external and unoptimized for this demo */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={sim.image}
                                    alt={sim.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white/90 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                                        {sim.tag}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-3 md:p-6 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {sim.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {sim.company}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex w-10 h-10 bg-muted rounded-full items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <p className="text-muted-foreground mt-4 mb-6 line-clamp-2">
                                    {sim.description}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4 mt-auto">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {sim.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BarChart className="w-4 h-4" /> {sim.level}
                                    </span>
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                        <CheckCircle className="w-4 h-4" /> Free Certification
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 w-full">
                        See all simulations
                    </button>
                </div>
            </div>
        </section>
    );
}
