'use client'

import { motion } from 'framer-motion'
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
import { cn } from '@/lib/utils'

export function FeaturesShowcase() {
  const i = useIntlayer('features-showcase')

  const features = [
    {
      icon: Banknote,
      title: i.accountManagement,
      description: i.accountManagementDescription,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Tag,
      title: i.smartCategories,
      description: i.smartCategoriesDescription,
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Receipt,
      title: i.transactionTracking,
      description: i.transactionTrackingDescription,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Target,
      title: i.budgetControl,
      description: i.budgetControlDescription,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Trophy,
      title: i.goalSetting,
      description: i.goalSettingDescription,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Bot,
      title: i.aiInsights,
      description: i.aiInsightsDescription,
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: BookOpen,
      title: i.learningCenter,
      description: i.learningCenterDescription,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: i.multiCurrency,
      description: i.multiCurrencyDescription,
      color: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            {i.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {i.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={`feature-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col items-start text-left">
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110 duration-500",
                  feature.color
                )}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-24 p-10 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center md:text-left">
             <h4 className="text-2xl font-bold mb-2">Ready to level up?</h4>
             <p className="text-muted-foreground">{i.manyMore}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background shadow-sm border border-border/50">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold">{i.realTimeAnalytics}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background shadow-sm border border-border/50">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold">{i.secureAndPrivate}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background shadow-sm border border-border/50">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold">{i.aiPowered}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
