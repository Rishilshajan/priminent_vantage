import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandSection } from "@/components/home/BrandSection";
import { FeaturedSimulations } from "@/components/home/FeaturedSimulations";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-poppins selection:bg-primary/20">
      <Navbar />
      <HeroSection />
      <BrandSection />
      <FeaturedSimulations />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
