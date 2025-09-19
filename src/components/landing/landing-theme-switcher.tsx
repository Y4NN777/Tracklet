'use client'

import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLandingTheme } from '../../contexts/landing-theme-context'

export function LandingThemeSwitcher() {
  const { landingTheme, setLandingTheme } = useLandingTheme()

  const toggleTheme = () => {
    setLandingTheme(landingTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background/90"
      aria-label={`Switch to ${landingTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {landingTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}