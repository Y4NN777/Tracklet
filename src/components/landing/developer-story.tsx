'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Quote } from 'lucide-react'

export function DeveloperStory() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Developer Avatar */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                    <img
                      src="/they4nn-photo.jpeg"
                      alt="The Y4NN - Developer & Creator"
                      className="w-full h-full object-cover object-center"
                      style={{ imageRendering: 'auto' }}
                    />
                  </div>
                </motion.div>

                {/* Story Content */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    className="flex items-center justify-center md:justify-start gap-2 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Quote className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">Built by a Developer, For others developers and everyone struggling with finances management</h3>
                  </motion.div>

                  <motion.p
                    className="text-lg text-muted-foreground mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    As a developer who struggled with personal finance management, I created FinTrack
                    to help others achieve financial clarity through free, open source software.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-center md:text-left">
                      <p className="font-semibold text-lg">TheY4NN</p>
                      <p className="text-sm text-muted-foreground">Developer</p>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>Open Source Advocate</span>
                      <span>•</span>
                      <span>Finances & Economics, dAPPs & Blockchain Enthusiast</span>
                      
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Mission Statement */}
              <motion.div
                className="mt-8 pt-8 border-t border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-center text-muted-foreground italic">
                  "Our mission is simple: To empower individuals with the tools and knowledge they need to take control
                  of their finances, break free from financial stress, and build a more secure financial future."
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}