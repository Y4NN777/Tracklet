import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
const API_BASE_PATH = '/api/v1'

const normalizeBaseUrl = (base: string) => base.replace(/\/+$/, '')

const resolveApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    if (configuredApiBaseUrl && configuredApiBaseUrl.startsWith('http')) {
      return normalizeBaseUrl(configuredApiBaseUrl)
    }
    return `${normalizeBaseUrl(appUrl)}${API_BASE_PATH}`
  }

  if (!configuredApiBaseUrl || configuredApiBaseUrl === '' || configuredApiBaseUrl.includes('localhost')) {
    return API_BASE_PATH
  }

  if (configuredApiBaseUrl.startsWith('http')) {
    return normalizeBaseUrl(configuredApiBaseUrl)
  }

  return configuredApiBaseUrl.startsWith('/') ? configuredApiBaseUrl : `/${configuredApiBaseUrl}`
}

const buildApiUrl = (path: string) => {
  const base = resolveApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (base.startsWith('http')) {
    return `${base}${normalizedPath}`
  }

  return `${base}${normalizedPath}`.replace(/\/{2,}/g, '/')
}

// Use service role key for server-side operations (API routes), regular key for client-side
const isServerSide = typeof window === 'undefined'
const keyToUse = isServerSide && supabaseServiceKey ? supabaseServiceKey : supabaseKey

export const supabase = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: !isServerSide, // Disable auto refresh for server-side
    persistSession: !isServerSide,   // Disable session persistence for server-side
    detectSessionInUrl: !isServerSide
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password (calls server-side API route)
  signUp: async (userData: {
    email: string
    password: string
    full_name?: string
    agreeToTerms: boolean
  }) => {
    try {
      // Call server-side API route for signup
      const response = await fetch(buildApiUrl('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        return { data: null, error: result.error }
      }

      return { data: result.data, error: null }
    } catch (error) {
//      console.error('Signup error:', error)
      return { data: null, error: { message: 'Network error during signup' } }
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/en/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }
}

// Database helper functions
export const db = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Create user profile
  createUserProfile: async (profile: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: {
    full_name?: string
    avatar_url?: string
    preferences?: any
    onboarding_step?: number
    onboarding_completed?: boolean
    onboarding_completed_at?: string
  }) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Update user preferences
  updateUserPreferences: async (userId: string, preferences: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        preferences: preferences
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Update onboarding progress
  updateOnboardingProgress: async (userId: string, step: number, completed: boolean = false) => {
    const updates: any = {
      onboarding_step: step,
      onboarding_completed: completed
    }

    if (completed) {
      updates.onboarding_completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}
