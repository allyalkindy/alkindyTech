"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'
import { SectionEyebrow } from './section-eyebrow'

export function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const experiences = [
    {
      company: "Zanzibar Insurance Corporation",
      position: "Frontend Intern",
      period: "2024",
      location: "Zanzibar, Tanzania",
      description: "Developed and maintained frontend components for insurance management systems using modern web technologies.",
      achievements: [
        "Built responsive user interfaces using React.js and TypeScript",
        "Collaborated with backend developers to integrate APIs",
        "Improved user experience through modern UI/UX design principles",
        "Participated in code reviews and agile development processes"
      ],
    },
    {
      company: "Business and Property Registration Agency",
      position: "IT Intern",
      period: "2023",
      location: "Dar es Salaam, Tanzania",
      description: "Gained hands-on experience in IT infrastructure and system administration while supporting digital transformation initiatives.",
      achievements: [
        "Assisted in system maintenance and troubleshooting",
        "Supported database management and data integrity",
        "Participated in user training and technical support",
        "Contributed to documentation and process improvement"
      ],
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section id="experience" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <SectionEyebrow index="04" label="Experience" />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
              A track record of
              <br />
              <span className="italic text-primary underline-swipe">shipping</span> real software.
            </h2>
          </motion.div>

          <div className="divide-y divide-border border-y border-border">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="grid sm:grid-cols-12 gap-4 sm:gap-8 py-10"
              >
                <div className="sm:col-span-3">
                  <span className="font-serif italic text-3xl text-muted-foreground/40">0{index + 1}</span>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </div>
                </div>
                <div className="sm:col-span-9">
                  <h3 className="font-serif text-2xl text-foreground mb-1">{exp.position}</h3>
                  <p className="text-primary font-semibold mb-4">{exp.company}</p>
                  <p className="text-muted-foreground leading-relaxed mb-5">{exp.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="text-center mt-14">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Let's Work Together
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
