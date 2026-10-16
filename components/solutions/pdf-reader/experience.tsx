"use client"

// Wraps the hero copy, the reader itself, and the step cards in one client
// component so all three can share "is the user actually reading right
// now" — once they open the book, the hero text and step cards collapse
// out of the way so the book gets the room instead of competing with
// marketing copy for space.

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, UploadCloud, BookOpen, RefreshCw } from "lucide-react"
import { PdfReader } from "./index"

const steps = [
  { icon: UploadCloud, title: "Upload a PDF", description: "Stays on your device, never uploaded" },
  { icon: BookOpen, title: "Open & Read", description: "Real page-turns, two-up on a wide screen" },
  { icon: RefreshCw, title: "Pick Up Later", description: "Refresh and your page is still there" },
]

const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto" as const, opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
}

export function PdfReaderExperience() {
  const [isReading, setIsReading] = useState(false)

  return (
    <>
      <section className="relative pt-32 sm:pt-40 overflow-hidden">
        {!isReading && (
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All Solutions
          </Link>

          <AnimatePresence initial={false}>
            {!isReading && (
              <motion.div key="hero-text" {...collapse} className="overflow-hidden">
                <div className="max-w-2xl pb-16 sm:pb-20">
                  <h1 className="font-serif text-5xl sm:text-6xl text-foreground leading-[1.05] mb-6">
                    Read it like
                    <br />
                    <span className="italic text-primary underline-swipe">an actual book.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    Upload a PDF and turn its pages for real — open the cover, flip through a
                    two-page spread on a wide screen, one page at a time on your phone.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PdfReader onReadingChange={setIsReading} />
        </div>
      </section>

      <AnimatePresence initial={false}>
        {!isReading && (
          <motion.section key="steps" {...collapse} className="overflow-hidden border-t border-border">
            <div className="py-16 sm:py-20">
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
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
