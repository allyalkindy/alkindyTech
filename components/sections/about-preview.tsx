"use client"

import { motion } from 'framer-motion'
import {
  Code,
  Palette,
  Zap,
  Heart,
  MapPin,
  Briefcase,
} from 'lucide-react'
import { SectionEyebrow } from './section-eyebrow'

export function AboutPreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stats = [
    { label: "Live Projects", value: "4" },
    { label: "Technologies", value: "10+" },
    { label: "Years Building", value: "3+" },
    { label: "Client Rating", value: "5.0★" },
  ]

  const values = [
    { icon: Code, title: "Clean Code", description: "Maintainable, scalable solutions" },
    { icon: Palette, title: "Custom Design", description: "Built for your brand, not a template" },
    { icon: Zap, title: "Performance", description: "Fast-loading, SEO-friendly builds" },
    { icon: Heart, title: "User-Centric", description: "Solutions that serve real business goals" },
  ]

  return (
    <section id="about" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <SectionEyebrow index="02" label="About" />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
              The person behind
              <br />
              the <span className="italic text-primary underline-swipe">code</span>.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column - Story & Stats */}
            <div className="lg:col-span-7">
              <motion.div
                variants={itemVariants}
                className="relative bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-professional"
              >
                <span className="absolute top-6 right-8 font-serif italic text-sm text-muted-foreground/50">AS / 02</span>
                <h3 className="text-2xl sm:text-3xl font-serif mb-4 text-foreground">Ally M. Said</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">Dar es Salaam, Tanzania · Remote-friendly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm">Founder, alkindyTech</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base sm:text-lg">
                  I&apos;m a web developer crafting digital experiences that bridge the gap between
                  beautiful design and powerful functionality. I build custom websites and web
                  applications for businesses that need more than a template — with a strong
                  foundation in modern web technologies and a keen eye for detail, I turn ideas
                  into software people actually enjoy using.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React.js", "Next.js", "TypeScript", "Tailwind CSS"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-y border-border"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="px-4 py-6 text-center first:pl-0 last:pr-0">
                    <div className="font-serif text-3xl sm:text-4xl text-foreground mb-1">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Values */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6">
                What I Value
              </h3>
              <div className="divide-y divide-border border-t border-border">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4 py-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-0.5">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
