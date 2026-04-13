"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Code, 
  Palette, 
  Zap, 
  Heart, 
  ArrowRight, 
  MapPin, 
  GraduationCap,
  Users,
  Award,
  Calendar,
  Star
} from 'lucide-react'
import Link from 'next/link'

export function AboutPreview() {
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
      transition: { duration: 0.6 }
    }
  }

  const stats = [
    { label: "Projects", value: "15+", icon: Code },
    { label: "Clients", value: "12+", icon: Users },
    { label: "Experience", value: "3+ Years", icon: Calendar },
    { label: "Technologies", value: "10+", icon: Star }
  ]

  const values = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Maintainable, scalable solutions"
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description: "Visually stunning interfaces"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Lightning-fast experiences"
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Solutions that serve users"
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full w-16" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                About Me
              </Badge>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full w-16" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text-primary">Crafting Digital Excellence</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Passionate frontend developer with a mission to transform ideas into exceptional digital experiences
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Story & Stats */}
            <div className="lg:col-span-7">
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm mb-8">
                  <CardContent className="p-8 sm:p-10">
                  <div className="flex flex-col items-center  space-y-6">
                 
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                          <span className="gradient-text-primary">Ally M. Said</span>
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 text-gray-400 mb-4">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Dar es Salaam, Tanzania</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-sm">Computer Engineering</span>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          I&apos;m a passionate frontend developer crafting digital experiences that bridge the gap between 
                          beautiful design and powerful functionality. With a strong foundation in modern web technologies 
                          and a keen eye for detail, I transform ideas into exceptional digital solutions.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            React.js
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Next.js
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            TypeScript
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Tailwind CSS
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index} className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Values & CTA */}
            <div className="lg:col-span-5">
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm mb-8">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 text-center">
                      What I Value
                    </h3>
                    <div className="space-y-4">
                      {values.map((value, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <value.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">{value.title}</h4>
                            <p className="text-sm text-gray-400">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

             
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
