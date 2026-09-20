"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Building2,
  Globe,
  Smartphone,
  CheckCircle,
  ArrowUpRight,
  Search,
  PenTool,
  Code2,
  Rocket,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import { SectionEyebrow } from './section-eyebrow'

export function BusinessCTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      icon: Globe,
      title: "Business Websites",
      description: "Professional, responsive websites that represent your brand and drive conversions",
      features: ["Custom Design", "Mobile Responsive", "SEO Optimized"]
    },
    {
      icon: Building2,
      title: "E-commerce Solutions",
      description: "Complete online stores with payment processing and inventory management",
      features: ["Payment Integration", "Order Tracking", "Admin Dashboard"]
    },
    {
      icon: Smartphone,
      title: "Web Applications",
      description: "Custom web applications tailored to your business needs and workflows",
      features: ["User Authentication", "Real-time Updates", "Scalable Architecture"]
    }
  ]

  const process = [
    { icon: Search, title: "Discover", description: "Define your goals, audience, and what the site needs to achieve" },
    { icon: PenTool, title: "Design", description: "A custom look built around your brand — no generic templates" },
    { icon: Code2, title: "Build", description: "Clean, tested code with regular check-ins along the way" },
    { icon: Rocket, title: "Launch", description: "Your site goes live, with support after to keep it running" },
  ]

  const handleGetStarted = () => {
    toast.success("Let's build your dream website!", {
      description: "I'll get back to you within 24 hours to discuss your project.",
    })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <>
      <section className="py-24 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="max-w-7xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-14">
              <SectionEyebrow index="06" label="Solutions" />
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mt-6 max-w-2xl leading-[1.1]">
                Software built to grow
                <br />
                your <span className="italic text-primary underline-swipe">business</span>.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mt-6">
                Let's build it together. I design and develop custom websites and web
                applications that help businesses establish their digital presence and
                grow their customer base.
              </p>
            </motion.div>

            {/* Services */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative bg-card border border-border rounded-2xl p-7"
                >
                  <span className="absolute top-6 right-7 font-serif italic text-sm text-muted-foreground/50">
                    0{index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>
                  <ul className="space-y-1.5">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle className="w-3.5 h-3.5 text-moss shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Process */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8">
                How We'll Work Together
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border border-y border-border">
                {process.map((step, index) => (
                  <div key={index} className="py-6 sm:py-8 sm:px-6 first:pl-0">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-5 h-5 text-primary" />
                      <span className="text-xs font-bold tracking-widest text-muted-foreground">STEP 0{index + 1}</span>
                    </div>
                    <h4 className="font-serif text-lg text-foreground mb-1.5">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission quote band */}
      <section className="bg-foreground text-background bg-grain py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-serif text-6xl sm:text-7xl text-primary leading-none">&ldquo;</span>
            <p className="font-serif text-2xl sm:text-4xl leading-snug mb-2 -mt-4">
              Every project should do two things: look like it belongs to your brand,
              and{" "}
              <span className="italic text-primary">actually move your business forward.</span>
            </p>
            <p className="text-background/60 mt-8 max-w-xl mx-auto">
              That's the standard I hold every build to — from a five-page business site
              to a full web application.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-serif text-3xl sm:text-5xl leading-tight mb-6">
              Ready to transform your business online?
            </h3>
            <p className="text-primary-foreground/80 mb-8">
              Typical reply time: within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
              >
                Start Your Project
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <a
                href="mailto:allymohammedsaid126@gmail.com"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/40 rounded-full px-6 py-[14px] text-base font-semibold hover:border-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Me Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
