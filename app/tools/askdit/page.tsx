import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { Sparkles, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AskDit",
  description: "AskDit is an in-progress AI assistant project. Details coming soon.",
  robots: { index: false, follow: false },
};

export default function AskDitPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[75vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-border bg-card">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                AskDit
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] mb-6">
              This one&apos;s still
              <br />
              <span className="italic text-primary underline-swipe">in the workshop.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
              AskDit is a project in active development. Check back soon, or reach out if
              you'd like to hear more about it in the meantime.
            </p>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Get in Touch
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
