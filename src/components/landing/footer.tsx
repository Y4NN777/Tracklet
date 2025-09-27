'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Mail, Linkedin, Heart } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'

export function Footer() {
  // Fix 1: Use the key string directly, not footerContent.key
  const i = useIntlayer('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.h3
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {i.Tracklet}
            </motion.h3>
            <motion.p
              className="text-muted-foreground mb-6 max-w-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {i.description}
            </motion.p>
            <motion.div
              className="flex items-center gap-1 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span>{i.madeWith}</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{i.byDevelopers}</span>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              className="font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {i.quickLinks}
            </motion.h4>
            <motion.ul
              className="space-y-2 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  {i.getStarted}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  {i.signIn}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Y4NN777/Tracklet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {i.githubRepository}
                </a>
              </li>
              <li>
                <Link href="/onboarding/terms" className="hover:text-primary transition-colors font-medium">
                  {i.termsOfService}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Y4NN777/Tracklet/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {i.reportIssues}
                </a>
              </li>
            </motion.ul>
          </div>

          {/* Community */}
          <div>
            <motion.h4
              className="font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {i.community}
            </motion.h4>
            <motion.ul
              className="space-y-2 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <li>
                <Link href="/onboarding/terms" className="hover:text-primary transition-colors">
                  {i.termsOfService}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Y4NN777/Tracklet/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {i.contributingGuide}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Y4NN777/Tracklet/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {i.discussions}
                </a>
              </li>
              <li>
                <a
                  href="mailto:y4nn.dev@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  {i.contactDeveloper}
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/y4nnthedev777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {i.linkedIn}
                </a>
              </li>
            </motion.ul>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {/* Simple concatenation approach */}
              {i.copyrightPrefix} {currentYear} {i.copyrightSuffix}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Y4NN777/Tracklet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={i.githubAria}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:y4nn.dev@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={i.emailAria}
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/y4nnthedev777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={i.linkedInAria}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}