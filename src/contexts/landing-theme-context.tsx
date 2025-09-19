'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type LandingTheme = 'light' | 'dark'

interface LandingThemeContextType {
  landingTheme: LandingTheme
  setLandingTheme: (theme: LandingTheme) => void
}

const LandingThemeContext = createContext<LandingThemeContextType | undefined>(undefined)

export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const [landingTheme, setLandingTheme] = useState<LandingTheme>('dark')

  // Apply landing page specific theme
  useEffect(() => {
    const root = document.documentElement

    // Store original theme classes
    const originalClasses = Array.from(root.classList)

    // Apply landing theme
    root.classList.remove('light', 'dark')
    root.classList.add(landingTheme)

    // Cleanup function to restore original theme when component unmounts
    return () => {
      root.classList.remove('light', 'dark')
      originalClasses.forEach(cls => {
        if (cls === 'light' || cls === 'dark') {
          root.classList.add(cls)
        }
      })
    }
  }, [landingTheme])

  return (
    <LandingThemeContext.Provider value={{ landingTheme, setLandingTheme }}>
      {children}
    </LandingThemeContext.Provider>
  )
}

export function useLandingTheme() {
  const context = useContext(LandingThemeContext)
  if (context === undefined) {
    throw new Error('useLandingTheme must be used within a LandingThemeProvider')
  }
  return context
}