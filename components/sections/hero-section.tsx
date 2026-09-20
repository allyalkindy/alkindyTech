"use client"

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export function HeroSection() {
  const handleStartProject = () => {
    toast.success("Let's build something amazing together!", {
      description: "I'll get back to you within 24 hours.",
    })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleViewWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24 sm:pt-40 sm:pb-28">
      {/* Ambient colour blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-moss/15 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
          {/* Left column — copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Web Developer · Software Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-[2.75rem] leading-[1.08] sm:text-6xl sm:leading-[1.08] lg:text-[4.25rem] lg:leading-[1.05] text-foreground mb-8"
            >
              I turn business problems
              <br />
              into{" "}
              <span className="italic text-primary underline-swipe">working</span> software.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              I'm <strong className="text-foreground font-semibold">Ally M. Said</strong>, the
              developer behind alkindyTech. I design and build custom websites and web
              applications — in React, Next.js, and TypeScript — for businesses that want
              more than a template.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={handleStartProject}
                className="group inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
              >
                Start a Project
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={handleViewWork}
                className="inline-flex items-center gap-2 border-2 border-foreground/20 text-foreground rounded-full px-6 py-[14px] text-base font-semibold hover:border-foreground transition-colors"
              >
                See My Work
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-14 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Available for new projects · Dar es Salaam, remote-friendly
              </span>
            </motion.div>
          </div>

          {/* Right column — collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative max-w-sm mx-auto">
              {/* Arched photo frame */}
              <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border border-border shadow-professional bg-muted">
                <Image
                  src="/assets/Ally.M.Said.jpeg"
                  alt="Ally M. Said - Web Developer"
                  fill
                  priority
                  sizes="(min-width: 1024px) 384px, 320px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
              </div>

              {/* Index number */}
              <span className="absolute -top-6 right-2 font-serif italic text-2xl text-muted-foreground/60">01</span>

              {/* Dark overlapping card */}
              <motion.div
                initial={{ opacity: 0, y: 10, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -left-8 sm:-left-12 top-[18%] w-44 bg-foreground text-background rounded-2xl p-5 shadow-professional"
              >
                <p className="font-serif italic text-lg leading-snug mb-3">
                  Design. Build. Launch.
                </p>
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">
                  How I Work
                </p>
              </motion.div>

              {/* Light overlapping card */}
              <motion.div
                initial={{ opacity: 0, y: 10, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="absolute -right-4 sm:-right-8 bottom-6 w-60 bg-card border border-border rounded-2xl p-4 shadow-professional flex items-center gap-3"
              >
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moss opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-moss" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">Open for work</p>
                  <p className="text-xs text-muted-foreground">1–2 new builds / month</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
