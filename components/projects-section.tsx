"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Github, Users, TrendingUp, Calendar, Globe } from 'lucide-react'
import { toast } from 'sonner'

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const projects = [
    {
      title: "Zadaawa",
      description: "A comprehensive Hajj travelling agency platform serving 300+ monthly visitors with seamless booking and travel management capabilities.",
      longDescription: "Built a full-stack web application for a Hajj travelling agency that handles complex booking systems, payment processing, and travel itinerary management. The platform serves over 300 visitors monthly and provides a complete digital solution for religious travel services.",
      image: "/assets/zadawa-live-demo.png",
      liveUrl: "https://zadaawa.com",
      githubUrl: null,
      technologies: ["React.js", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Payment Integration"],
      features: [
        "User registration and authentication",
        "Travel package booking system",
        "Payment processing integration",
        "Admin dashboard for travel management",
        "Responsive design for all devices",
        "Multi-language support"
      ],
      stats: {
        visitors: "300+",
        period: "monthly",
        status: "Production"
      },
      category: "E-commerce & Travel",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Aviground",
      description: "A pilot examination training platform in staging phase, nearly ready for production deployment with comprehensive learning modules.",
      longDescription: "Developed an advanced pilot examination training platform featuring interactive learning modules, practice tests, and progress tracking. The application is currently in staging phase and nearly ready for production deployment, providing aspiring pilots with comprehensive training resources.",
      image: "/assets/aviground-live-demo.png",
      liveUrl: "https://aviground.com",
      githubUrl: null,
      technologies: ["React.js", "Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      features: [
        "Interactive learning modules",
        "Practice examination system",
        "Progress tracking and analytics",
        "User performance dashboard",
        "Content management system",
        "Real-time progress updates"
      ],
      stats: {
        visitors: "Staging",
        period: "phase",
        status: "Near Production"
      },
      category: "Education & Training",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "CCS Sumoja Fund",
      description: "A comprehensive fund management system with 100+ registered users, providing complete financial tracking and management capabilities.",
      longDescription: "Created a sophisticated fund management system that handles financial transactions, user management, and comprehensive reporting. The platform serves over 100 registered users and provides a complete solution for fund administration, tracking, and management.",
      image: "/assets/umoja-fund-live-demo.png",
      liveUrl: "https://ccssumojafund-1.onrender.com",
      githubUrl: null,
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Authentication", "Chart.js"],
      features: [
        "User registration and authentication",
        "Fund contribution tracking",
        "Financial reporting and analytics",
        "Admin panel for fund management",
        "Transaction history and records",
        "Automated calculations and summaries"
      ],
      stats: {
        visitors: "100+",
        period: "registered users",
        status: "Production"
      },
      category: "Finance & Management",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const handleProjectClick = (url: string, title: string) => {
    toast.success(`Opening ${title}`, {
      description: "Redirecting to the live project...",
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="projects" className="py-20 bg-slate-900">
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
              Featured <span className="text-blue-400">Projects</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real-world applications built with <span className="text-blue-400 font-semibold">modern technologies</span>, serving actual users and businesses
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid lg:grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="border-0 shadow-colored-lg hover:shadow-glow-lg transition-all duration-500 bg-slate-800/50 backdrop-blur-md glass-strong overflow-hidden group">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <div className="h-64 lg:h-full relative">
                        <img
                          src={project.image}
                          alt={`${project.title} - Live Demo Screenshot`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                          <p className="text-sm opacity-90">{project.category}</p>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.stats.status === 'Production' 
                              ? 'bg-green-500/90 text-white' 
                              : 'bg-yellow-500/90 text-white'
                          }`}>
                            {project.stats.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <CardContent className="p-8">
                      <div className="h-full flex flex-col">
                        {/* Description */}
                        <div className="mb-6">
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {project.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{project.stats.visitors} {project.stats.period}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{project.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="mb-6 flex-1">
                          <h4 className="text-sm font-semibold mb-3">Key Features</h4>
                          <ul className="space-y-1">
                            {project.features.slice(0, 4).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {project.features.length > 4 && (
                              <li className="text-xs text-muted-foreground">
                                +{project.features.length - 4} more features
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleProjectClick(project.liveUrl, project.title)}
                            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Live</span>
                          </motion.button>
                          {project.githubUrl && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleProjectClick(project.githubUrl!, project.title)}
                              className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                            >
                              <Github className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-purple-500/5 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Interested in Working Together?</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact')
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start a Project
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
