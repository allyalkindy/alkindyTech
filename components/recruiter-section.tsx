"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Code2, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MapPin,
  Award,
  Zap,
  Database,
  Globe,
  GitBranch
} from 'lucide-react'
import { toast } from 'sonner'

export function RecruiterSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const technicalSkills = [
    {
      category: "Frontend Technologies",
      skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"],
      icon: Globe,
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Backend & APIs",
      skills: ["Node.js", "Express.js", "Next.js API", "RESTful APIs", "JWT Authentication"],
      icon: Database,
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Database & Storage",
      skills: ["MongoDB", "PostgreSQL", "Prisma", "Data Modeling"],
      icon: Database,
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Development Tools",
      skills: ["Git/GitHub", "CI/CD Pipelines","Cursor", "VS Code", "Docker"],
      icon: GitBranch,
      color: "from-orange-500 to-red-500"
    }
  ]

  const achievements = [
    {
      title: "Academic Excellence",
      description: "Maintaining 4.4/5 GPA in Computer Engineering",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Real-World Experience",
      description: "2 internships with hands-on development experience",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Production Projects",
      description: "3 live applications serving real users",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Modern Practices",
      description: "CI/CD, TypeScript, and modern development workflows",
      icon: Zap,
      color: "from-orange-500 to-red-500"
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

  const handleContact = () => {
    toast.success("Let's discuss opportunities!", {
      description: "I'm excited to learn about potential roles and how I can contribute to your team.",
    })
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-muted/30">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              For <span className="gradient-text">Recruiters</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              A passionate frontend developer with strong technical skills, real-world experience, and a drive to build exceptional user experiences
            </p>
          </motion.div>

       

          {/* Technical Skills */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Technical Expertise</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {technicalSkills.map((skillGroup, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${skillGroup.color} rounded-lg flex items-center justify-center`}>
                          <skillGroup.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">{skillGroup.category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Achievements */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Key Achievements</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <achievement.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What I'm Looking For */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">What I'm Looking For</h3>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    I'm actively seeking opportunities to grow as a frontend developer and contribute to innovative teams
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span>Internship Opportunities</span>
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Frontend development internships</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">React/Next.js focused roles</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Remote or hybrid positions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span>Full-Time Positions</span>
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Junior Frontend Developer roles</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">React/TypeScript positions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Growth-oriented companies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 max-w-4xl mx-auto">
              <CardContent className="p-12">
                <div className="mb-8">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Add Value to Your Team
                  </h3>
                  
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={handleContact}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Let's Connect
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const projectsSection = document.getElementById('projects')
                        if (projectsSection) {
                          projectsSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      View My Work
                    </Button>
                  </motion.div>
                </div>

                
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
