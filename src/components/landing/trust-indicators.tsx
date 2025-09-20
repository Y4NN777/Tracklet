'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Users, Shield } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'
import trustIndicatorsContent from './trust-indicators.content'

export function TrustIndicators() {
  // Alternative fix: Use the key but ensure proper function access
  const i = useIntlayer('trust-indicators')

  const trustIndicators = [
    {
      icon: Code,
      title: i.freeAndOpenSource,
      description: i.freeAndOpenSourceDescription,
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: i.communityDriven,
      description: i.communityDrivenDescription,
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: i.secureAndPrivate,
      description: i.secureAndPrivateDescription,
      color: 'text-purple-600'
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {i.trustedByDevelopers}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {i.trustedByDevelopersDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={`trust-indicator-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
              className="h-full"
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-200 ease-out will-change-transform">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 ${indicator.color}`}>
                    <indicator.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl">{indicator.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {indicator.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
            <Shield className="w-5 h-5" />
            <span className="font-medium">{i.dataProtected}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}