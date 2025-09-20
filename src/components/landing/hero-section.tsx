'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useIntlayer } from 'next-intlayer';

export function HeroSection() {
  const { title, subtitle, getStarted, signIn, trustIndicator } = useIntlayer("hero-section");

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
          {title.map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              {index < title.length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.h1>

        {/* Animated subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
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
              {getStarted}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/login">
              {signIn}
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
          {trustIndicator}
        </motion.p>
      </div>
    </section>
  )
}