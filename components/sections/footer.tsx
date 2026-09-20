"use client"

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/allyalkindy", icon: Github },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ally-mohammed-96a31a319", icon: Linkedin },
    { name: "Email", url: "mailto:allymohammedsaid126@gmail.com", icon: Mail }
  ]

  const quickLinks = [
    { name: "About", href: "/#about" },
    { name: "Work", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Skills", href: "/#skills" },
    { name: "Solutions", href: "/solutions" },
    { name: "Contact", href: "/#contact" }
  ]

  const goToLink = (href: string) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      document.querySelector(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = href
    }
  }

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="bg-foreground text-background bg-grain">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif italic text-2xl text-primary">alkindy</span>
              <span className="font-sans font-bold text-2xl text-background">Tech</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Custom websites and web applications, built for businesses that want more
              than a template.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  onClick={() => handleSocialClick(social.url)}
                  className="w-10 h-10 border border-background/20 hover:border-primary hover:text-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-background/50">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => goToLink(link.href)}
                    className="text-background/75 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-background/50">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <button
                onClick={() => handleSocialClick("mailto:allymohammedsaid126@gmail.com")}
                className="flex items-center gap-2 text-background/75 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                allymohammedsaid126@gmail.com
              </button>
              <button
                onClick={() => handleSocialClick("https://wa.me/255655206601")}
                className="flex items-center gap-2 text-background/75 hover:text-primary transition-colors"
              >
                +255 655 206 601
              </button>
              <div className="text-background/60">Dar es Salaam, Tanzania</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-14 pt-8 border-t border-background/15 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <span className="text-sm text-background/50">© {currentYear} alkindyTech. All rights reserved.</span>
          <div className="flex items-center gap-2 text-sm text-background/50">
            <span>Made with</span>
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Heart className="w-4 h-4 text-primary fill-current" />
            </motion.span>
            <span>by Ally M. Said</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
