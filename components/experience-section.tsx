"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Calendar, MapPin, Code, Database, Users } from 'lucide-react'

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
      icon: Building2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      company: "Business and Property Registration Agency",
      position: "IT Intern",
      period: "2023",
      location: "Dar es Salaam, Tanzania",
      description: "Gained hands-on experience in IT infrastructure and system administration while supporting various digital transformation initiatives.",
      achievements: [
        "Assisted in system maintenance and troubleshooting",
        "Supported database management and data integrity",
        "Participated in user training and technical support",
        "Contributed to documentation and process improvement"
      ],
      icon: Database,
      color: "from-green-500 to-emerald-500"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Professional <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Building real-world solutions through internships and hands-on development experience
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary/50 hidden md:block" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full border-4 border-background shadow-lg hidden md:block z-10" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="ml-0 md:ml-16"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                          <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                            <div className={`w-12 h-12 bg-gradient-to-r ${exp.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <exp.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{exp.position}</h3>
                              <h4 className="text-lg font-medium text-primary mb-2">{exp.company}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{exp.period}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{exp.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {exp.description}
                        </p>

                        <div>
                          <h5 className="font-semibold mb-3 flex items-center space-x-2">
                            <Code className="w-4 h-4" />
                            <span>Key Achievements</span>
                          </h5>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: 0.5 + (index * 0.3) + (idx * 0.1) }}
                                className="flex items-start space-x-3 text-sm text-muted-foreground"
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-purple-500/5 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Users className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-semibold">Ready for New Challenges</h3>
                </div>
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
                    Let's Work Together
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const projectsSection = document.getElementById('projects')
                      if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    View My Projects
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
