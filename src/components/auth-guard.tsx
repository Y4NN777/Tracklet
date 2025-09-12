'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireOnboarding = true
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth check error:', error)
          if (requireAuth) {
            router.push('/login')
            return
          }
        }

        // If auth is required but no session
        if (requireAuth && !session) {
          router.push('/login')
          return
        }

        // If user is authenticated and onboarding is required
        if (session && requireOnboarding) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single()

            if (profileError) {
              console.error('Profile check error:', profileError)
              // If profile doesn't exist, redirect to onboarding
              if (pathname !== '/onboarding') {
                router.push('/onboarding')
                return
              }
            } else if (profile && !profile.onboarding_completed) {
              // Profile exists but onboarding not completed
              if (pathname !== '/onboarding') {
                router.push('/onboarding')
                return
              }
            } else if (profile && profile.onboarding_completed && pathname === '/onboarding') {
              // User completed onboarding but trying to access onboarding page
              router.push('/')
              return
            }
          } catch (error) {
            console.error('Onboarding check error:', error)
            // On error, redirect to onboarding to be safe
            if (pathname !== '/onboarding') {
              router.push('/onboarding')
              return
            }
          }
        }

        // If we get here, user is authorized
        setAuthorized(true)

      } catch (error) {
        console.error('Auth guard error:', error)
        if (requireAuth) {
          router.push('/login')
          return
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' && requireAuth) {
          router.push('/login')
        } else if (event === 'SIGNED_IN' && session) {
          // Re-check authorization after sign in
          checkAuth()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, pathname, requireAuth, requireOnboarding])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we set up your account.</p>
        </div>
      </div>
    )
  }

  return authorized ? <>{children}</> : null
}