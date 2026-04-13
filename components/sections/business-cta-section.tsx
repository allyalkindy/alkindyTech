"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Globe, 
  Smartphone, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

export function BusinessCTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      icon: Globe,
      title: "Business Websites",
      description: "Professional, responsive websites that represent your brand and drive conversions",
      features: ["Custom Design", "Mobile Responsive", "SEO Optimized", "Fast Loading"]
    },
    {
      icon: Building2,
      title: "E-commerce Solutions",
      description: "Complete online stores with payment processing and inventory management",
      features: ["Payment Integration", "Product Management", "Order Tracking", "Admin Dashboard"]
    },
    {
      icon: Smartphone,
      title: "Web Applications",
      description: "Custom web applications tailored to your business needs and workflows",
      features: ["User Authentication", "Data Management", "Real-time Updates", "Scalable Architecture"]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Get your website live in 2-4 weeks with regular updates and communication"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Thorough testing and optimization to ensure your site works perfectly"
    },
    {
      icon: Users,
      title: "Ongoing Support",
      description: "Continued maintenance and updates to keep your website running smoothly"
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Websites designed to convert visitors into customers and grow your business"
    }
  ]

  const testimonials = [
    {
      quote: "Ally delivered an exceptional website that perfectly represents our business. The attention to detail and modern design exceeded our expectations.",
      author: "Business Owner",
      rating: 5
    },
    {
      quote: "Professional, reliable, and skilled. Our new website has significantly improved our online presence and customer engagement.",
      author: "Company Director",
      rating: 5
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

  const handleGetStarted = () => {
    toast.success("Let's build your dream website!", {
      description: "I'll get back to you within 24 hours to discuss your project.",
    })
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
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
              Want a Professional Website for Your <span className="gradient-text">Business?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Let's build it together. I create modern, responsive websites that help businesses establish their digital presence and grow their customer base.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose alkindyTech?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">What Clients Say</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-muted-foreground italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-sm font-medium">— {testimonial.author}</cite>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 max-w-4xl mx-auto">
              <CardContent className="p-12">
                <div className="mb-8">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Transform Your Business Online?
                  </h3>
                
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Hire Me Now
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
