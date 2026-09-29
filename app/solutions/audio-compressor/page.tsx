import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Upload, Gauge, Download } from "lucide-react";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { AudioCompressor } from "@/components/solutions/audio-compressor";

export const metadata: Metadata = {
  title: "Audio Compressor",
  description:
    "Compress audio with the real LAME MP3 encoder, right in your browser. Pick a bitrate, hear the before and after yourself, then download — free, no sign-up, nothing uploaded to a server.",
  alternates: {
    canonical: "/solutions/audio-compressor",
  },
};

const steps = [
  { icon: Upload, title: "Upload", description: "Drop in your audio — MP3, WAV, M4A, OGG, or FLAC" },
  { icon: Gauge, title: "Choose Quality", description: "Pick a bitrate and see the estimated size instantly" },
  { icon: Download, title: "Compare & Download", description: "Listen to both, then download the compressed MP3" },
];

export default function AudioCompressorPage() {
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
              Smaller files,
              <br />
              <span className="italic text-primary underline-swipe">same sound.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Upload an audio file and compress it with the real LAME MP3 encoder —
              the same engine behind Audacity and most professional audio tools.
              Pick your quality, listen to the before and after yourself, then download.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AudioCompressor />
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
