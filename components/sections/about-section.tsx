"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GraduationCap, MapPin, Calendar, Code2, Target, Award, Users, Lightbulb } from 'lucide-react'

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const stats = [
    { label: "GPA", value: "4.4/5", icon: Award },
    { label: "Graduation", value: "2026", icon: Calendar },
    { label: "Projects", value: "10+", icon: Code2 },
    { label: "Clients", value: "5+", icon: Users }
  ]

  const coreSkills = [
    'React.js', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS',
    'Python', 'Git', 'CI/CD', 'Machine Learning', 'Anaconda'
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">About Me</span>
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white">
              Crafting Digital
              <br />
              <span className="gradient-text-primary">Excellence</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Passionate about creating <span className="text-blue-400 font-semibold">exceptional digital experiences</span> that bridge the gap between innovative design and powerful functionality
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Story & Stats */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
              {/* Main Story Card */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
                <CardContent className="p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">My Story</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                      I'm <span className="text-blue-400 font-semibold">Ally M. Said</span>, a passionate Computer Engineering student at 
                      <span className="text-blue-400 font-semibold"> Dar es Salaam Institute of Technology (DIT)</span> with a strong focus on 
                      frontend development and modern web technologies. With a GPA of 4.4/5, I'm dedicated to excellence in both academics and practical application.
                    </p>
                    
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                      As a freelance web developer under the <span className="text-blue-400 font-semibold">alkindyTech</span> brand, I specialize in creating 
                      modern, responsive websites that help businesses establish their digital presence. My goal is to bridge the gap between 
                      beautiful design and powerful functionality.
                    </p>
                    
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                      I'm also actively seeking opportunities as a frontend developer, bringing my expertise in React, Next.js, 
                      and modern development practices to innovative teams and projects.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              {/* Education Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-blue-900/20 backdrop-blur-sm shadow-xl shadow-blue-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-2 text-white">Education</h4>
                        <p className="text-gray-300 text-sm mb-3 font-medium">
                          Bachelor of Engineering in Computer Engineering
                        </p>
                        <p className="text-blue-400 text-sm font-semibold mb-4">Dar es Salaam Institute of Technology (DIT)</p>
                        <div className="flex items-center space-x-6 text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>2022 - 2026</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Dar es Salaam, Tanzania</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-cyan-900/20 backdrop-blur-sm shadow-xl shadow-cyan-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-2 text-white">Core Expertise</h4>
                        <p className="text-gray-300 text-sm">Technologies I work with</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {coreSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-7 h-7 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-3 text-white">My Mission</h4>
                        <p className="text-gray-300 text-sm leading-relaxed italic">
                          "To create digital experiences that not only look stunning but also solve real-world problems, 
                          helping businesses grow and succeed in the digital landscape."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Separator */}
          <motion.div variants={itemVariants} className="mt-20 flex justify-center">
            <Separator className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
