'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
import Image from 'next/image'
import { useLandingTheme } from '../../contexts/landing-theme-context'

const techItems = [
  { name: 'Google Gemini AI', icon: '/gemini-ai.png', color: 'text-blue-500' },
  { name: 'Next.js 15', icon: '/nextjs.png', color: 'text-black' },
  { name: 'Supabase', icon: '/supabase.png', color: 'text-emerald-500' },
  { name: 'Open Source', icon: Github, color: 'text-gray-800' },
  { name: 'TypeScript', icon: '/typescript.png', color: 'text-blue-600' },
  { name: 'React', icon: '/react.png', color: 'text-cyan-400' },
  { name: 'PostgreSQL', icon: '/postgresql.png', color: 'text-blue-800' },
  { name: 'Shadcn/ui', icon: '/shadcn-ui.png', color: 'text-gray-900' }
]

export function TechScroll() {
  const [isHovered, setIsHovered] = useState(false)
  const { landingTheme } = useLandingTheme()

  const duplicatedItems = [...techItems, ...techItems, ...techItems]

  return (
    <div className="w-full bg-slate-50/50 py-3 border-b border-slate-200/60 overflow-hidden select-none">
      <motion.div
        className="flex gap-4 items-center"
        animate={{
          x: [0, -techItems.length * 160],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200/80 rounded-full shadow-sm hover:border-primary/30 transition-colors group"
          >
            {typeof tech.icon === 'string' ? (
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <tech.icon className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
            )}
            <span className="text-sm font-bold text-slate-700 whitespace-nowrap tracking-tight">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
