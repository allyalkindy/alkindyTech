"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Palette, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function HeroSection() {
  const handleHireMe = () => {
    toast.success("Let's build something amazing together!", {
      description: "I'll get back to you within 24 hours.",
    })
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleViewWork = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16 mb-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Content (hidden on mobile, shown on lg+) */}
          <div className="hidden lg:block text-center lg:text-left">
            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                <span className="gradient-text-primary">alkindyTech</span>
              </h1>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto lg:mx-0 rounded-full w-24" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight"
            >
              Crafting Modern Websites
              <br />
              <span className="text-blue-400">That Drive Success</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Professional freelance web developer specializing in React, Next.js, and modern web technologies. 
              Building exceptional digital experiences for businesses worldwide.
            </motion.p>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hidden sm:flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-12"
            >
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Code className="w-4 h-4 mr-2" />
                Clean Code
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Palette className="w-4 h-4 mr-2" />
                Modern Design
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Fast Performance
              </Badge>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <Button
                onClick={handleHireMe}
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white px-10 sm:px-12 py-5 text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 border border-blue-400/30 hover:border-cyan-400/50 group overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative flex items-center z-10">
                  <span className="mr-3 tracking-wide">Let's Build Together</span>
                  <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </span>
              </Button>
              <Button
                onClick={handleViewWork}
                className="px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold border-2 border-blue-500 text-white-400 hover:bg-blue-500 hover:text-white-100 transition-colors duration-200 rounded-lg"
              >
                View My Work
              </Button>
            </motion.div>
          </div>

          {/* Mobile Brand Name (shown first on mobile) */}
          <div className="lg:hidden text-center order-first mt-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-0"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                <span className="gradient-text-primary">alkindyTech</span>
              </h1>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full w-24" />
            </motion.div>
          </div>

          {/* Right Column - Profile Avatar (shown second on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end order-2 lg:order-none -mt-4 lg:mt-0"
          >
            <div className="relative">
              {/* Profile Image with professional styling */}
              <div className="flex flex-col items-center space-y-6">
                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-88 lg:h-88 relative">
                  {/* Cutting-edge geometric border */}
                  <div className="absolute inset-0 rounded-full">
                    {/* Outer cutting border with geometric pattern */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 p-2">
                      {/* Inner cutting pattern */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 relative overflow-hidden">
                        {/* Geometric cutting lines */}
                        <div className="absolute inset-0 rounded-full">
                          {/* Top cutting line */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                          {/* Bottom cutting line */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                          {/* Left cutting line */}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
                          {/* Right cutting line */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
                          
                          {/* Corner cutting elements */}
                          <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rotate-45"></div>
                          <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rotate-45"></div>
                          <div className="absolute bottom-4 left-4 w-3 h-3 bg-cyan-400 rotate-45"></div>
                          <div className="absolute bottom-4 right-4 w-3 h-3 bg-cyan-400 rotate-45"></div>
                        </div>
                        
                        {/* Image container */}
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img 
                              src="/assets/Ally.M.Said.jpeg" 
                              alt="Ally M. Said - Frontend Developer"
                              className="w-full h-full object-cover"
                              style={{ 
                                objectPosition: 'center center',
                                transform: 'scale(1.2)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cutting-edge shadow with multiple layers */}
                  <div className="absolute inset-0 rounded-full shadow-2xl shadow-blue-500/30"></div>
                  <div className="absolute inset-2 rounded-full shadow-xl shadow-cyan-400/20"></div>
                  
                </div>
                
                {/* Name Design */}
                <div className="text-center relative">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 rounded-2xl blur-xl"></div>
                  
                  {/* Main name with professional effects */}
                  <div className="relative z-10">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-wide">
                      <span className="relative inline-block">
                        <span className="gradient-text-primary drop-shadow-lg">Ally M. Said</span>
                        {/* Subtle shadow for depth */}
                        <span className="absolute inset-0 gradient-text-primary opacity-30 blur-sm">Ally M. Said</span>
                      </span>
                    </h3>
                    
                    {/* Professional subtitle with enhanced styling */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                      <p className="text-blue-300 font-semibold text-base sm:text-lg tracking-wider uppercase letter-spacing-wider">
                        Frontend Developer
                      </p>
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                    </div>
                    
                    {/* Professional divider with gradient */}
                    <div className="relative">
                      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                      <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm"></div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="mt-4 hidden sm:flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-green-400 text-sm font-medium tracking-wide">Available for Projects</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>

          {/* Mobile Content Section (shown after photo on mobile) */}
          <div className="lg:hidden text-center -mt-2 order-3">
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-12 leading-tight"
            >
              Crafting Modern Websites
              <br />
              <span className="text-blue-400">That Drive Success</span>
            </motion.h2>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex justify-center items-center mb-16"
            >
              <Button
                onClick={handleHireMe}
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white px-10 sm:px-12 py-5 text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 border border-blue-400/30 hover:border-cyan-400/50 group overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative flex items-center z-10">
                  <span className="mr-3 tracking-wide">Let's Build Together</span>
                  <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}