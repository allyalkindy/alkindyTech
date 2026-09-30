import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Link2, Radio, Lock } from "lucide-react";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { YoutubeListener } from "@/components/solutions/youtube-listener";

export const metadata: Metadata = {
  title: "YouTube Listener",
  description:
    "Paste a YouTube link and listen to the audio with real lock-screen controls. Audio streams progressively — nothing is downloaded in full.",
  alternates: {
    canonical: "/solutions/youtube-listener",
  },
  // Scopes PWA installability to just this page, rather than the whole site.
  manifest: "/manifest.json",
};

const steps = [
  { icon: Link2, title: "Paste a Link", description: "Any standard YouTube video URL" },
  { icon: Radio, title: "Stream the Audio", description: "Fetched in small chunks, not one big download" },
  { icon: Lock, title: "Lock & Listen", description: "Play, pause, and seek from your lock screen" },
];

export default function YoutubeListenerPage() {
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
              Paste a link,
              <br />
              <span className="italic text-primary underline-swipe">keep listening.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Drop in a YouTube link and play the audio through real lock-screen controls —
              streamed progressively, a few seconds at a time, straight from our server.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <YoutubeListener />
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

          <p className="text-center text-xs text-muted-foreground mt-10 max-w-lg mx-auto">
            For personal and educational use only. Not intended for public or commercial
            redistribution of copyrighted content.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
