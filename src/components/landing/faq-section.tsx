'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'
// import faqSectionContent from './faq-section.content'

export function FAQSection() {
  const i = useIntlayer('faq-section')

  const faqs = [
    {
      question: i.isTrackletFree,
      answer: i.isTrackletFreeAnswer
    },
    {
      question: i.canIContribute,
      answer: i.canIContributeAnswer
    },
    {
      question: i.isDataSecure,
      answer: i.isDataSecureAnswer
    },
    {
      question: i.whatMakesTrackletDifferent,
      answer: i.whatMakesTrackletDifferentAnswer
    },
    {
      question: i.doINeedFinancialKnowledge,
      answer: i.doINeedFinancialKnowledgeAnswer
    }
  ]

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
            <h2 className="text-3xl md:text-4xl font-bold">{i.frequentlyAskedQuestions}</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {i.everythingYouNeedToKnow}
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
              <CardTitle className="text-center">{i.commonQuestions}</CardTitle>
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
            {i.stillHaveQuestions}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Y4NN777/Tracklet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {i.viewDocumentation}
            </a>
            <a
              href="https://github.com/Y4NN777/Tracklet/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {i.askOnGitHub}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}