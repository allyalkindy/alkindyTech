"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Code2, 
  Globe, 
  Database, 
  GitBranch, 
  Palette, 
  Zap, 
  Smartphone, 
  Server,
  FileText,
  Cpu,
  Cloud
} from 'lucide-react'

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "React.js", level: 95, description: "Advanced component development and state management" },
        { name: "Next.js", level: 90, description: "Full-stack React framework with App Router" },
        { name: "TypeScript", level: 85, description: "Type-safe JavaScript development" },
        { name: "HTML/CSS", level: 95, description: "Semantic markup and modern CSS techniques" },
        { name: "Tailwind CSS", level: 90, description: "Utility-first CSS framework" },
        { name: "JavaScript", level: 90, description: "Modern ES6+ features and async programming" }
      ]
    },
    {
      title: "Backend Development",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Node.js", level: 80, description: "Server-side JavaScript runtime" },
        { name: "Express.js", level: 75, description: "Web application framework for Node.js" },
        { name: "Next.js API", level: 85, description: "API routes and serverless functions" },
        { name: "RESTful APIs", level: 80, description: "Designing and implementing REST APIs" },
        { name: "Authentication", level: 75, description: "JWT and session-based authentication" }
      ]
    },
    {
      title: "Database & Storage",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "MongoDB", level: 80, description: "NoSQL document database" },
        { name: "PostgreSQL", level: 70, description: "Relational database management" },
        { name: "Prisma", level: 75, description: "Database ORM and query builder" },
        { name: "Data Modeling", level: 75, description: "Database design and optimization" }
      ]
    },
    {
      title: "Development Tools",
      icon: GitBranch,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Git/GitHub", level: 85, description: "Version control and collaboration" },
        { name: "CI/CD Pipelines", level: 70, description: "Automated deployment and testing" },
        { name : "Cursor", level: 90, description: "AI-powered code editor" },
        { name: "VS Code", level: 90, description: "Code editor and development environment" },
        { name: "Docker", level: 60, description: "Containerization and deployment" }
      ]
    },
    {
      title: "Additional Skills",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      skills: [
        { name: "Python", level: 75, description: "Data analysis and automation" },
        { name: "Machine Learning", level: 65, description: "Anaconda and ML frameworks" },
        { name: "React Query", level: 80, description: "Data fetching and caching" },
        { name: "Responsive Design", level: 90, description: "Mobile-first development" }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <section id="skills" className="py-20 bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Technical <span className="text-blue-400">Skills</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit for building <span className="text-blue-400 font-semibold">modern, scalable</span> web applications
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="group"
              >
                <Card className="border border-slate-700 bg-slate-900/50 shadow-professional hover:shadow-lg transition-all duration-300 h-full group">
                  <CardContent className="p-6">
                    {/* Category Header */}
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-4">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          variants={skillVariants}
                          className="group/skill"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-slate-800/50">
                              {skill.name}
                            </Badge>
                            <span className="text-xs text-gray-400">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div
                              className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                              initial={{ width: 0 }}
                              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                              transition={{ duration: 1, delay: 0.5 + (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-200">
                            {skill.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Experience Level */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Fast Learner</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick to adapt to new technologies and frameworks, always staying current with industry trends
                  </p>
                </CardContent>
              </Card>

              {/* Problem Solving */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Problem Solver</h3>
                  <p className="text-sm text-muted-foreground">
                    Strong analytical thinking and debugging skills to tackle complex technical challenges
                  </p>
                </CardContent>
              </Card>

              {/* Team Player */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Collaborative</h3>
                  <p className="text-sm text-muted-foreground">
                    Excellent communication skills and experience working in agile development teams
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-purple-500/5 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Ready to Leverage These Skills</h3>
              
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const contactSection = document.getElementById('contact')
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Let's Collaborate
                  </motion.button>
                 
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
