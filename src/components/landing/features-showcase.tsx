'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Banknote,
  Tag,
  Receipt,
  Target,
  Trophy,
  Bot,
  BookOpen,
  Globe,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react'
import { useIntlayer } from 'next-intlayer'

export function FeaturesShowcase() {
  const i = useIntlayer('features-showcase')

  const features = [
    {
      icon: Banknote,
      title: i.accountManagement,
      description: i.accountManagementDescription,
      color: 'text-blue-600'
    },
    {
      icon: Tag,
      title: i.smartCategories,
      description: i.smartCategoriesDescription,
      color: 'text-green-600'
    },
    {
      icon: Receipt,
      title: i.transactionTracking,
      description: i.transactionTrackingDescription,
      color: 'text-purple-600'
    },
    {
      icon: Target,
      title: i.budgetControl,
      description: i.budgetControlDescription,
      color: 'text-orange-600'
    },
    {
      icon: Trophy,
      title: i.goalSetting,
      description: i.goalSettingDescription,
      color: 'text-yellow-600'
    },
    {
      icon: Bot,
      title: i.aiInsights,
      description: i.aiInsightsDescription,
      color: 'text-indigo-600'
    },
    {
      icon: BookOpen,
      title: i.learningCenter,
      description: i.learningCenterDescription,
      color: 'text-teal-600'
    },
    {
      icon: Globe,
      title: i.multiCurrency,
      description: i.multiCurrencyDescription,
      color: 'text-pink-600'
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
            {i.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {i.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={`feature-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
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
          <p className="text-lg text-muted-foreground mb-6">
            {i.manyMore}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {i.realTimeAnalytics}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {i.secureAndPrivate}
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {i.aiPowered}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}