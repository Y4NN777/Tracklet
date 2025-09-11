import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password (single-call API)
  signUp: async (userData: {
    email: string
    password: string
    full_name?: string
    agreeToTerms: boolean
  }) => {
    // Validate terms acceptance
    if (!userData.agreeToTerms) {
      return { error: { message: 'Terms must be accepted' } }
    }

    // Create auth user + profile atomically
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (error || !data.user) return { data, error }

    // Create profile with full data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: data.user.id,
        email: userData.email,
        full_name: userData.full_name,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString()
      }])
      .select()
      .single()

    return { data: { ...data, profile }, error: profileError }
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
        redirectTo: `${window.location.origin}/auth/callback`
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
      redirectTo: `${window.location.origin}/auth/reset-password`
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