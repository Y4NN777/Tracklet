'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-4xl mx-auto">
        {/* Animated headline */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI-Powered Personal
          <br />
          Finance Management
        </motion.h1>

        {/* Animated subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Take control of your finances with intelligent insights and smart recommendations.
          Free, open source software built by developers for everyone.
        </motion.p>

        {/* Animated CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/login">
              Sign In
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          className="text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Join thousands of users managing their finances smarter
        </motion.p>
      </div>
    </section>
  )
}