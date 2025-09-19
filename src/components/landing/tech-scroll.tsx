'use client'

import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
import Image from 'next/image'
import { useLandingTheme } from '../../contexts/landing-theme-context'

const techItems = [
  { name: 'Google Gemini AI', icon: '/gemini-ai.png', color: 'text-blue-500' },
  { name: 'Next.js 15', icon: '/nextjs.png', color: 'text-black dark:text-white' },
  { name: 'Supabase', icon: '/supabase.png', color: 'text-green-600' },
  { name: 'Open Source', icon: Github, color: 'text-gray-700 dark:text-gray-300' },
  { name: 'TypeScript', icon: '/typescript.png', color: 'text-blue-600' },
  { name: 'React', icon: '/react.png', color: 'text-blue-400' },
  { name: 'PostgreSQL', icon: '/postgresql.png', color: 'text-blue-700' },
  {
    name: 'Shadcn/ui',
    icon: { light: '/shadcn-ui.png', dark: '/shadcn-ui-white.png' },
    color: 'text-gray-700 dark:text-gray-200'
  }
]

export function TechScroll() {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const { landingTheme } = useLandingTheme()

  // Duplicate the array for seamless infinite scroll
  const duplicatedItems = [...techItems, ...techItems]

  // Start animation when component mounts
  useEffect(() => {
    controls.start({
      x: [0, -120 * techItems.length],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }
    })
  }, [controls])

  // Pause/resume animation based on hover state
  useEffect(() => {
    if (isHovered) {
      controls.stop()
    } else {
      controls.start({
        x: [0, -120 * techItems.length],
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }
      })
    }
  }, [isHovered, controls])

  return (
    <div className="w-full bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-4 overflow-hidden">
        <motion.div
          className="flex gap-8 items-center"
          animate={controls}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: 'max-content' }}
        >
          {duplicatedItems.map((tech, index) => (
            <motion.div
              key={`${tech.name}-${index}`}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-primary/5 transition-colors bg-background/80 backdrop-blur-sm"
              >
                {typeof tech.icon === 'string' ? (
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} logo`}
                    width={16}
                    height={16}
                    className={`w-4 h-4 mr-2 ${tech.color}`}
                  />
                ) : typeof tech.icon === 'object' && tech.icon.light && tech.icon.dark ? (
                  <Image
                    src={landingTheme === 'dark' ? tech.icon.dark : tech.icon.light}
                    alt={`${tech.name} logo`}
                    width={16}
                    height={16}
                    className={`w-4 h-4 mr-2 ${tech.color}`}
                  />
                ) : (
                  React.createElement(tech.icon as any, {
                    className: `w-4 h-4 mr-2 ${tech.color}`
                  })
                )}
                {tech.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}