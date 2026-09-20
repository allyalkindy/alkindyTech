"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Github,
  Linkedin,
  ArrowUpRight,
  Copy,
  Check,
  Globe,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { SectionEyebrow } from './section-eyebrow'

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const contactMethods = [
    {
      title: "WhatsApp",
      description: "Quick response for urgent inquiries",
      icon: MessageCircle,
      url: "https://wa.me/255655206601",
      responseTime: "Within 1 hour"
    },
    {
      title: "Phone Call",
      description: "Direct conversation for detailed discussions",
      icon: Phone,
      url: "tel:+255655206601",
      responseTime: "Business hours"
    },
    {
      title: "Email",
      description: "Professional communication and project details",
      icon: Mail,
      url: "mailto:allymohammedsaid126@gmail.com",
      responseTime: "Within 24 hours"
    }
  ]

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/allyalkindy", icon: Github, description: "View my code and projects" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ally-mohammed-96a31a319", icon: Linkedin, description: "Professional network and experience" }
  ]

  const availability = [
    "Available for new client projects",
    "Currently taking 1-2 new builds per month",
    "Open to long-term maintenance & retainer work",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  }

  const handleContactClick = (url: string, title: string) => {
    toast.success(`Opening ${title}`, { description: "Let's start a conversation!" })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('allymohammedsaid126@gmail.com')
      setCopiedEmail(true)
      toast.success("Email copied to clipboard!")
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      toast.error("Failed to copy email")
    }
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+255 655 206 601')
      setCopiedPhone(true)
      toast.success("Phone number copied to clipboard!")
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch {
      toast.error("Failed to copy phone number")
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-14">
            <SectionEyebrow index="07" label="Let's Connect" />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
              Let's build something
              <br />
              <span className="italic text-primary underline-swipe">worth</span> shipping.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mt-6">
              Whether you're a business looking for a custom website or web application, or
              you just want to talk through an idea — I'm here to help bring your vision to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left Column - Quick Contact Methods */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <div className="grid sm:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <button
                    key={index}
                    onClick={() => handleContactClick(method.url, method.title)}
                    className="text-left p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
                  >
                    <method.icon className="w-6 h-6 text-primary mb-4" />
                    <h4 className="font-serif text-lg text-foreground mb-1.5">{method.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">
                      {method.responseTime}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Copy */}
              <div className="mt-6 bg-card border border-border rounded-2xl p-6 space-y-3">
                <h4 className="font-serif text-lg text-foreground mb-2">Quick Copy</h4>
                <div className="flex items-center justify-between p-3 bg-muted/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground/80">allymohammedsaid126@gmail.com</span>
                  </div>
                  <button onClick={handleCopyEmail} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Copy email">
                    {copiedEmail ? <Check className="w-4 h-4 text-moss" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground/80">+255 655 206 601</span>
                  </div>
                  <button onClick={handleCopyPhone} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Copy phone number">
                    {copiedPhone ? <Check className="w-4 h-4 text-moss" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Info */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-7">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-1">Location</h4>
                    <p className="text-sm text-muted-foreground mb-2">Dar es Salaam, Tanzania</p>
                    <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                      <Globe className="w-3.5 h-3.5" />
                      Available for remote work worldwide
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-7">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-primary shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-foreground mb-3">Current Availability</h4>
                    <div className="space-y-2">
                      {availability.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-moss shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-7">
                <h4 className="font-serif text-lg text-foreground mb-4">Follow Along</h4>
                <div className="space-y-1">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      onClick={() => handleContactClick(social.url, social.name)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/60 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <social.icon className="w-5 h-5 text-foreground/70" />
                        <div className="text-left">
                          <div className="text-sm font-semibold text-foreground">{social.name}</div>
                          <div className="text-xs text-muted-foreground">{social.description}</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
