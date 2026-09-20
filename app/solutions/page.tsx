import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Productized software solutions from alkindyTech are in development. In the meantime, get in touch to discuss a custom website or web application for your business.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 -right-32 w-[28rem] h-[28rem] rounded-full bg-moss/15 blur-[120px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-border bg-card">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Solutions
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-8">
              Something new is
              <br />
              <span className="italic text-primary underline-swipe">coming soon.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              I'm putting together a set of ready-made solutions for businesses that need
              a fast, reliable path to a great website or application. This page will
              share the details as soon as they're ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:allymohammedsaid126@gmail.com"
                className="group inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                Need something now? Let's talk
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 border-2 border-foreground/20 text-foreground rounded-full px-6 py-[14px] text-base font-semibold hover:border-foreground transition-colors"
              >
                See What I've Built
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
