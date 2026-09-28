import type { Metadata } from "next";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { SectionEyebrow } from "@/components/sections/section-eyebrow";
import { SolutionsGrid } from "@/components/solutions/solutions-grid";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Small, focused tools from alkindyTech — built well, free to use, and growing. Start with the Sticker Generator: turn a logo and a link into a print-ready QR sticker.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-40 pb-16 sm:pt-48 sm:pb-20 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-moss/15 blur-[120px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <SectionEyebrow index="01" label="Solutions" />
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground mt-6 leading-[1.05]">
              Small tools,
              <br />
              built <span className="italic text-primary underline-swipe">well</span>.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mt-8 leading-relaxed">
              Free, focused utilities I build for businesses that need one job done
              properly — no sign-up, no clutter. Starting here, growing over time.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SolutionsGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
