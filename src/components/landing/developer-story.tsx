'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'

export function DeveloperStory() {
  const i = useIntlayer('developer-story')

  return (
    <section className="py-24 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Developer Avatar with decorative rings */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/they4nn-photo.jpeg"
                  alt={i.altText}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white shadow-xl -rotate-12 border-4 border-background">
                 <Quote className="w-12 h-12 fill-current" />
              </div>
            </motion.div>

            {/* Story Content */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{i.title}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed italic">
                  "{i.story}"
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div>
                  <p className="font-black text-2xl text-primary uppercase tracking-tighter">{i.name}</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{i.role}</p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div className="flex gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span className="px-3 py-1 rounded-full bg-background border border-border">{i.openSourceAdvocate}</span>
                  <span className="px-3 py-1 rounded-full bg-background border border-border">{i.enthusiast}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mission Statement */}
          <motion.div
            className="mt-20 p-8 md:p-12 rounded-[3rem] bg-background border-2 border-primary/10 shadow-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-xl md:text-2xl text-center font-medium leading-relaxed max-w-4xl mx-auto">
              <span className="text-primary font-black uppercase mr-2 text-sm tracking-widest block mb-4">The Mission</span>
              {i.mission}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
