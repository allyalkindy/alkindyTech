"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Code2,
  Globe,
  Database,
  GitBranch,
  Palette,
  Zap,
  Server,
  Cpu,
  ArrowUpRight,
} from 'lucide-react'
import { SectionEyebrow } from './section-eyebrow'

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skillCategories = [
    {
      title: "Frontend",
      icon: Globe,
      skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"],
    },
    {
      title: "Backend",
      icon: Server,
      skills: ["Node.js", "Express.js", "Next.js API", "RESTful APIs", "Authentication"],
    },
    {
      title: "Database & Storage",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "Prisma", "Data Modeling"],
    },
    {
      title: "Dev Tools",
      icon: GitBranch,
      skills: ["Git/GitHub", "CI/CD", "Cursor", "VS Code", "Docker"],
    },
    {
      title: "Additional",
      icon: Cpu,
      skills: ["Python", "Machine Learning", "React Query", "Responsive Design"],
    },
  ]

  const traits = [
    { icon: Zap, title: "Fast Learner", description: "Quick to adapt to new technologies and frameworks" },
    { icon: Code2, title: "Problem Solver", description: "Strong analytical thinking for complex technical challenges" },
    { icon: Palette, title: "Collaborative", description: "Clear communication and experience in agile teams" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section id="skills" className="py-24 sm:py-32 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <SectionEyebrow index="05" label="Skills" />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
              A toolkit built for
              <br />
              <span className="italic text-primary underline-swipe">scalable</span> software.
            </h2>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-muted text-foreground/80 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Traits */}
          <motion.div variants={itemVariants} className="mt-16 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border">
            {traits.map((trait, index) => (
              <div key={index} className="p-6 sm:p-8 text-center">
                <trait.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <h3 className="font-serif text-lg text-foreground mb-2">{trait.title}</h3>
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-14">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Let's Collaborate
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
