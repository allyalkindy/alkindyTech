import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Upload, QrCode, Download } from "lucide-react";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { StickerGenerator } from "@/components/solutions/sticker-generator";

export const metadata: Metadata = {
  title: "Sticker Generator",
  description:
    "Turn a logo and a link into a print-ready QR sticker in seconds. Free, no sign-up, runs entirely in your browser — download instantly as a PDF.",
  alternates: {
    canonical: "/solutions/sticker-generator",
  },
};

const steps = [
  { icon: Upload, title: "Upload", description: "Drop in your logo — any common image format works" },
  { icon: QrCode, title: "Generate", description: "Paste your link and the QR code builds itself" },
  { icon: Download, title: "Download", description: "Get a print-ready PDF, sized and ready to go" },
];

export default function StickerGeneratorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All Solutions
          </Link>

          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl sm:text-6xl text-foreground leading-[1.05] mb-6">
              Logo. Link.
              <br />
              <span className="italic text-primary underline-swipe">Sticker.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Upload a logo, paste a link, and get a clean, print-ready QR sticker —
              no sign-up, no watermark, nothing saved on a server.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl">
            <StickerGenerator />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="py-6 sm:py-8 sm:px-8 text-center first:pl-0 last:pr-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-widest text-muted-foreground">
                  STEP 0{index + 1}
                </span>
                <h3 className="font-serif text-lg text-foreground mt-1 mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
