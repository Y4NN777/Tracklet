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
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
           <div className="container mx-auto px-4 h-20 flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center gap-2">
                    <LandingThemeSwitcher />
                    <LanguageSwitcher />
                 </div>
                 <Button asChild variant="ghost" className="font-bold">
                    <Link href="/login">Login</Link>
                 </Button>
                 <Button asChild className="rounded-full font-bold px-6">
                    <Link href="/signup">Get Started</Link>
                 </Button>
              </div>
           </div>
        </header>

        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Tech Credibility Infinite Scroll */}
          <div className="py-10 bg-muted/30 border-y border-border/50">
             <TechScroll />
          </div>

          {/* Features Showcase */}
          <FeaturesShowcase />

          {/* Developer's Story */}
          <DeveloperStory />

          {/* Trust Indicators */}
          <TrustIndicators />

          {/* FAQ Section */}
          <FAQSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Floating Action Menu */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col gap-2">
           <LandingThemeSwitcher />
           <LanguageSwitcher />
        </div>
      </div>
    </LandingThemeProvider>
  )
}
