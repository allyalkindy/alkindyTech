"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, Users, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { SectionEyebrow } from './section-eyebrow'

const featuredProjects = [
  {
    title: "Whitecaps Safaris",
    longDescription: "Designed and built a full travel platform for Whitecaps Safaris, covering wildlife safaris, mountain trekking, island escapes, and cultural tours across Tanzania. The site pairs an editorial, high-end visual identity with fast-loading pages, direct WhatsApp booking, and clear trip information — giving the agency a digital presence that matches the caliber of the experiences it sells.",
    image: "/assets/whitecapes-live-demo.png",
    liveUrl: "https://whitecaps.vercel.app",
    technologies: ["React.js", "Next.js", "Tailwind CSS"],
    features: [
      "Custom booking funnel with direct WhatsApp inquiries",
      "Experience categories for safaris, trekking, islands and culture",
      "Google reviews and trust signals surfaced on the homepage",
      "Fully responsive, fast-loading build",
    ],
    stat: "5.0★ Google rating, 24 reviews",
    category: "Travel & Hospitality",
  },
  {
    title: "Binary Flow",
    longDescription: "Designed and built the marketing site for Binary Flow, a software development studio offering custom builds, integrations, and long-term support. The homepage leads with a clear value proposition, a fully working light/dark theme, and a trusted-by strip of real client logos — giving the studio a credible, modern presence for bringing in new project inquiries.",
    image: "/assets/binary-Flow-Tech-live-demo.png",
    liveUrl: "https://binary-flow-tech.vercel.app",
    technologies: ["React.js", "Next.js", "Tailwind CSS"],
    features: [
      "Working light/dark theme toggle",
      "Services, Process, Projects and Reviews sections",
      "Trusted-by carousel featuring real client brands",
      "Device-mockup hero for instant context",
    ],
    stat: "Trusted by Clubzila, Zamotto, Kuza Business & more",
    category: "Software Agency",
  },
]

const projects = [
  {
    title: "Zadaawa",
    description: "A comprehensive Hajj travelling agency platform serving 300+ monthly visitors with seamless booking and travel management.",
    image: "/assets/zadawa-live-demo.png",
    liveUrl: "https://zadaawa.com",
    technologies: ["React.js", "Next.js", "Node.js", "MongoDB"],
    stat: "300+ monthly visitors",
    category: "E-commerce & Travel",
    status: "Production",
  },
  {
    title: "Aviground",
    description: "A pilot examination training platform in staging, nearly ready for production with comprehensive learning modules.",
    image: "/assets/aviground-live-demo.png",
    liveUrl: "https://aviground.com",
    technologies: ["React.js", "Next.js", "TypeScript", "Prisma"],
    stat: "Staging phase",
    category: "Education & Training",
    status: "Near Production",
  },
  {
    title: "CCS Sumoja Fund",
    description: "A comprehensive fund management system with 100+ registered users and complete financial tracking.",
    image: "/assets/umoja-fund-live-demo.png",
    liveUrl: "https://ccssumojafund-1.onrender.com",
    technologies: ["React.js", "Node.js", "MongoDB", "Chart.js"],
    stat: "100+ registered users",
    category: "Finance & Management",
    status: "Production",
  },
]

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const handleProjectClick = (url: string, title: string) => {
    toast.success(`Opening ${title}`, { description: "Redirecting to the live project..." })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="projects" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <SectionEyebrow index="03" label="Selected Work" />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
              Real products, real
              <br />
              <span className="italic text-primary underline-swipe">businesses</span>.
            </h2>
          </motion.div>

          {/* Featured projects */}
          <div className="space-y-8 mb-8">
            {featuredProjects.map((featured, fIndex) => (
              <motion.div key={featured.title} variants={itemVariants}>
                <div className="grid lg:grid-cols-2 gap-0 bg-card border border-primary/30 rounded-2xl overflow-hidden shadow-professional">
                  <div className={`relative h-72 lg:h-auto ${fIndex % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={featured.image}
                      alt={`${featured.title} - Live Demo Screenshot`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/95 text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-professional">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Featured
                    </div>
                  </div>
                  <div className={`p-8 sm:p-10 flex flex-col ${fIndex % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold tracking-widest uppercase text-primary">{featured.category}</span>
                      <span className="font-serif italic text-sm text-muted-foreground/60">AS / 0{fIndex + 1}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">{featured.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-5">{featured.longDescription}</p>

                    <div className="flex items-center gap-2 mb-5 text-sm font-medium text-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      {featured.stat}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {featured.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {featured.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleProjectClick(featured.liveUrl, featured.title)}
                      className="mt-auto inline-flex items-center gap-2 self-start bg-foreground text-background rounded-full pl-6 pr-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      View Live
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other projects */}
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} - Live Demo Screenshot`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 font-serif italic text-white/90 text-sm drop-shadow">
                    AS / 0{index + 3}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-primary">{project.category}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      project.status === 'Production' ? 'bg-moss/15 text-moss' : 'bg-primary/15 text-primary'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">{project.stat}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-muted text-muted-foreground text-[11px] font-medium rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleProjectClick(project.liveUrl, project.title)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    View Live
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-5">Interested in working together?</p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
