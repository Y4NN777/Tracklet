import { Suspense } from 'react'
import { TechScroll } from '@/components/landing/tech-scroll'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesShowcase } from '@/components/landing/features-showcase'
import { DeveloperStory } from '@/components/landing/developer-story'
import { TrustIndicators } from '@/components/landing/trust-indicators'
import { FAQSection } from '@/components/landing/faq-section'
import { Footer } from '@/components/landing/footer'
import { LandingThemeSwitcher } from '@/components/landing/landing-theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LandingThemeProvider } from '@/contexts/landing-theme-context'

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <div className="min-h-screen bg-background">
        <div className="absolute top-20 right-4 z-50 flex flex-col gap-2">
          <LandingThemeSwitcher />
          <LanguageSwitcher />
        </div>

        {/* Tech Credibility Infinite Scroll */}
        <TechScroll />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Showcase */}
        <FeaturesShowcase />

        {/* Developer's Story */}
        <DeveloperStory />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>
    </LandingThemeProvider>
  )
}