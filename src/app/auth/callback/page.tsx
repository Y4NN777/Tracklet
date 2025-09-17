
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setError('Authentication failed. Please try again.')
          return
        }

        if (data.session) {
          const { user } = data.session

          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist - this is a new user, create profile and go to onboarding
            console.log('Creating profile for user:', user.id, user.email)

            const profileData = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              avatar_url: user.user_metadata?.avatar_url,
              preferences: {
                theme: 'system',
                currency: 'USD',
                dateFormat: 'MM/DD/YYYY',
                notifications: {
                  budgetAlerts: true,
                  goalReminders: true
                }
              },
              onboarding_step: 0,
              onboarding_completed: false,
              terms_accepted: false
            }

            console.log('Profile data to insert:', profileData)

            const { data: createdProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert([profileData])
              .select()

            if (createError) {
              console.error('Error creating profile:', createError)
              console.error('Error details:', JSON.stringify(createError, null, 2))
              setError(`Failed to create user profile: ${createError.message || 'Unknown error'}`)
              return
            }

            console.log('Profile created successfully:', createdProfile)

            // New user - go to terms acceptance first
            router.push('/onboarding/terms')
          } else if (profile) {
            // Profile exists - check if terms accepted
            if (!profile.terms_accepted) {
              // Existing user who hasn't accepted terms - go to terms acceptance
              router.push('/onboarding/terms')
            } else {
              // Existing user with accepted terms - go to dashboard
              router.push('/')
            }
          } else {
            // Error fetching profile
            console.error('Error fetching profile:', profileError)
            setError('Error loading user profile. Please try again.')
            return
          }
        } else {
          setError('No session found. Please try logging in again.')
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
          <p className="text-muted-foreground">Please wait while we set up your account...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
}