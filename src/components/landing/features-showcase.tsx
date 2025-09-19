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

const features = [
  {
    icon: Banknote,
    title: 'Account Management',
    description: 'Track all your bank accounts, credit cards, and investments in one place with real-time balance calculations.',
    color: 'text-blue-600'
  },
  {
    icon: Tag,
    title: 'Smart Categories',
    description: 'Organize transactions with intelligent categorization, custom categories, and color coding for easy identification.',
    color: 'text-green-600'
  },
  {
    icon: Receipt,
    title: 'Transaction Tracking',
    description: 'Comprehensive income and expense logging with category association and advanced search and filtering.',
    color: 'text-purple-600'
  },
  {
    icon: Target,
    title: 'Budget Control',
    description: 'Create and monitor budgets with visual progress indicators and spending alerts to stay on track.',
    color: 'text-orange-600'
  },
  {
    icon: Trophy,
    title: 'Goal Setting',
    description: 'Set and track financial goals with progress visualization and milestone celebrations.',
    color: 'text-yellow-600'
  },
  {
    icon: Bot,
    title: 'AI Insights',
    description: 'Get personalized financial advice powered by Google Gemini AI with interactive analysis.',
    color: 'text-indigo-600'
  },
  {
    icon: BookOpen,
    title: 'Learning Center',
    description: 'Master personal finance with our bilingual educational chatbot covering 7 structured learning themes.',
    color: 'text-teal-600'
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Manage finances globally with automatic currency conversion and real-time exchange rates.',
    color: 'text-pink-600'
  }
]

export function FeaturesShowcase() {
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
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to give you complete control over your financial health
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
            And many more features to help you achieve financial clarity
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Real-time Analytics
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure & Private
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}