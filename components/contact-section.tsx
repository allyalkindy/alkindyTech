"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink,
  Copy,
  Check,
  Send,
  Clock,
  Globe,
  User,
  MessageSquare,
  ArrowRight,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const contactMethods = [
    {
      title: "WhatsApp",
      description: "Quick response for urgent inquiries",
      icon: MessageCircle,
      action: "Chat Now",
      url: "https://wa.me/255655206601",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      textColor: "text-green-400",
      responseTime: "Within 1 hour"
    },
    {
      title: "Phone Call",
      description: "Direct conversation for detailed discussions",
      icon: Phone,
      action: "Call Now",
      url: "tel:+255655206601",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-400",
      responseTime: "Business hours"
    },
    {
      title: "Email",
      description: "Professional communication and project details",
      icon: Mail,
      action: "Send Email",
      url: "mailto:allymohammedsaid126@gmail.com",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      textColor: "text-purple-400",
      responseTime: "Within 24 hours"
    }
  ]

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/allysaid",
      icon: Github,
      description: "View my code and projects",
      color: "text-gray-400 hover:text-white"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/allysaid",
      icon: Linkedin,
      description: "Professional network and experience",
      color: "text-blue-400 hover:text-blue-300"
    }
  ]

  const availability = [
    { status: "Available for new projects", available: true },
    { status: "Open to internship opportunities", available: true },
    { status: "Interested in full-time positions", available: true }
  ]

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

  const handleContactClick = (url: string, title: string) => {
    toast.success(`Opening ${title}`, {
      description: "Let's start a conversation!",
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('allymohammedsaid126@gmail.com')
      setCopiedEmail(true)
      toast.success("Email copied to clipboard!")
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      toast.error("Failed to copy email")
    }
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+255 655 206 601')
      setCopiedPhone(true)
      toast.success("Phone number copied to clipboard!")
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch (err) {
      toast.error("Failed to copy phone number")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    toast.success("Message sent successfully!", {
      description: "I'll get back to you within 24 hours.",
    })
    setFormData({ name: '', email: '', message: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
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
              <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">Let's Connect</span>
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white">
            Contact <span className="gradient-text-primary">Me</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Whether you're a business looking for a professional website or a company seeking a talented developer, 
              <span className="text-blue-400 font-semibold"> I'm here to help bring your vision to life.</span>
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
           

              {/* Quick Contact Methods */}
              <div className="grid md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleContactClick(method.url, method.title)}
                  >
                    <div className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <method.icon className={`w-8 h-8 ${method.textColor}`} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{method.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{method.description}</p>
                    <Badge className={`${method.bgColor} ${method.textColor} ${method.borderColor} text-xs`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {method.responseTime}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              {/* Location Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-blue-900/20 backdrop-blur-sm shadow-xl shadow-blue-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-2 text-white">Location</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          Dar es Salaam, Tanzania
                        </p>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">Available for remote work worldwide</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Social Links Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-cyan-900/20 backdrop-blur-sm shadow-xl shadow-cyan-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Github className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-2 text-white">Follow Me</h4>
                        <p className="text-gray-300 text-sm">Connect on social platforms</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {socialLinks.map((social, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleContactClick(social.url, social.name)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-xl transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <social.icon className={`w-5 h-5 ${social.color}`} />
                            <div className="text-left">
                              <div className="font-medium text-white">{social.name}</div>
                              <div className="text-sm text-gray-400">{social.description}</div>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Availability Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-green-900/20 backdrop-blur-sm shadow-xl shadow-green-500/5">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-7 h-7 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-3 text-white">Current Availability</h4>
                        <div className="space-y-3">
                          {availability.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 ${item.available ? 'bg-green-400' : 'bg-gray-500'} rounded-full animate-pulse`}></div>
                              <span className="text-gray-300 text-sm">{item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Copy Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-sm shadow-xl shadow-purple-500/5">
                  <CardContent className="p-8">
                    <h4 className="font-bold text-xl mb-4 text-white">Quick Copy</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-purple-400" />
                          <span className="font-medium text-gray-300 text-sm">allymohammedsaid126@gmail.com</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyEmail}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-purple-400" />
                          <span className="font-medium text-gray-300 text-sm">+255 655 206 601</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyPhone}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          {copiedPhone ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </motion.button>
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
