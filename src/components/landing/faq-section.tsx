'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "Is FinTrack really free?",
    answer: "Yes, FinTrack is completely free with no hidden costs, subscriptions, or premium tiers. It's open source software that you can use forever without any payment."
  },
  {
    question: "Can I contribute to the development?",
    answer: "Absolutely! FinTrack is an open source project that welcomes contributions from developers of all skill levels. You can contribute code, report issues, suggest features, or help with documentation."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, we take security seriously. FinTrack uses JWT-based authentication, Supabase enterprise-grade database security, OAuth integration for secure user access, and data encryption at rest and in transit."
  },
  {
    question: "What makes FinTrack different from other finance apps?",
    answer: "FinTrack combines AI-powered insights with complete open source transparency. Unlike proprietary apps, you can see exactly how your data is handled, and the AI features are built specifically for personal finance management."
  },
  {
    question: "Do I need financial knowledge to use FinTrack?",
    answer: "Not at all! FinTrack includes a comprehensive Learning Center with AI-powered educational content in multiple languages. The app is designed to be user-friendly while teaching you financial concepts along the way."
  }
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about FinTrack
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <AccordionItem value={`item-${index}`} className="border-b border-muted">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Y4NN777/FinTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              View Documentation →
            </a>
            <a
              href="https://github.com/Y4NN777/FinTrack/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Ask on GitHub →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}