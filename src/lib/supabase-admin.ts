import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
}

// Admin client with service role - bypasses RLS for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Admin helper functions for operations that need to bypass RLS
export const adminDb = {
  // Create user profile during signup (bypasses RLS)
  createUserProfile: async (profile: {
    id: string
    email: string
    full_name?: string
    terms_accepted?: boolean
    terms_accepted_at?: string
  }) => {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()

    return { data, error }
  },

  // Update user profile (admin operations)
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Delete user profile (admin operations)
  deleteUserProfile: async (userId: string) => {
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    return { error }
  }
}