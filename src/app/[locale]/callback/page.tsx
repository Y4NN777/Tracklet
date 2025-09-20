
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useIntlayer } from 'next-intlayer';

export default function AuthCallback() {
  const i = useIntlayer('auth-callback-page');
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
//          console.error('Auth callback error:', error)
          setError(i.authenticationFailed)
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
//            console.log('Creating profile for user:', user.id, user.email)

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

//            console.log('Profile data to insert:', profileData)

            const { data: createdProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert([profileData])
              .select()

            if (createError) {
//              console.error('Error creating profile:', createError)
//              console.error('Error details:', JSON.stringify(createError, null, 2))
              setError(`${i.profileCreationFailed} ${createError.message || i.unknownError}`)
              return
            }

//            console.log('Profile created successfully:', createdProfile)

            // New user - go to terms acceptance first
            router.push('/terms')
          } else if (profile) {
            // Profile exists - check if terms accepted
            if (!profile.terms_accepted) {
              // Existing user who hasn't accepted terms - go to terms acceptance
              router.push('/terms')
            } else {
              // Existing user with accepted terms - go to dashboard
              router.push('/dashboard')
            }
          } else {
            // Error fetching profile
//            console.error('Error fetching profile:', profileError)
            setError(i.profileLoadError)
            return
          }
        } else {
          setError(i.noSessionError)
        }
      } catch (err) {
//        console.error('Unexpected error during auth callback:', err)
        setError(i.unexpectedError)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, i])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">{i.loadingTitle}</h2>
          <p className="text-muted-foreground">{i.loadingDescription}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">{i.errorTitle}</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {i.tryAgainButton}
          </button>
        </div>
      </div>
    )
  }

  return null
}