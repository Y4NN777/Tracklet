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
//          console.error('Auth check error:', error)
          if (requireAuth && pathname !== '/') {
            router.push('/login')
            return
          }
        }

        // If auth is required but no session, redirect to login (except for landing page)
        if (requireAuth && !session && pathname !== '/') {
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
              // Handle different types of errors appropriately
              if (profileError.code === 'PGRST116') {
                // Profile doesn't exist - redirect to onboarding
//                console.log('Profile not found, redirecting to onboarding')
                if (pathname !== '/onboarding') {
                  router.push('/onboarding')
                  return
                }
              } else {
                // Network/database error - allow access to prevent infinite loops
//                console.error('Profile check failed (allowing access):', profileError)
                // Don't redirect, allow user access to prevent loops
              }
            } else if (profile && !profile.onboarding_completed) {
              // Profile exists but onboarding not completed
//              console.log('Profile found but onboarding incomplete, redirecting to onboarding')
              if (pathname !== '/onboarding') {
                router.push('/onboarding')
                return
              }
            } else if (profile && profile.onboarding_completed && pathname === '/onboarding') {
              // User completed onboarding but trying to access onboarding page
//              console.log('Onboarding completed, redirecting to dashboard')
              router.push('/dashboard')
              return
            }
          } catch (error) {
//            console.error('Onboarding check error (allowing access):', error)
            // On unexpected error, allow access to prevent infinite loops
            // Don't redirect to onboarding
          }
        }

        // If we get here, user is authorized
        setAuthorized(true)

      } catch (error) {
//        console.error('Auth guard error:', error)
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

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname, requireAuth, requireOnboarding])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">
            {pathname === '/onboarding' ? 'Setting up your profile...' : 'Loading...'}
          </h2>
          <p className="text-muted-foreground">
            {pathname === '/onboarding'
              ? 'Please wait while we prepare your account.'
              : 'Please wait while we verify your account.'
            }
          </p>
        </div>
      </div>
    )
  }

  return authorized ? <>{children}</> : null
}