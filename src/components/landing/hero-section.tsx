'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useIntlayer } from 'next-intlayer';

export function HeroSection() {
  const { title, subtitle, getStarted, signIn, trustIndicator } = useIntlayer("hero-section");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 uppercase tracking-widest"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Finance
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {title.map((line: string, index: number) => (
              <span key={index} className={index === 1 ? "text-primary" : ""}>
                {line}
                {index < title.length - 1 && <br />}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Button asChild size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 group">
              <Link href="/signup">
                {getStarted}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-bold border-2 hover:bg-muted/50">
              <Link href="/login">
                {signIn}
              </Link>
            </Button>
          </motion.div>

          {/* Trust Features */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
             <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider">Bank-level Security</span>
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider">Instant Insights</span>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
