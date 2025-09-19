import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Only create admin client if we're on the server and have the service key
let supabaseAdmin: SupabaseClient | null = null

if (typeof window === 'undefined' && supabaseServiceKey) {
  // We're on the server side
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else if (typeof window !== 'undefined') {
  // We're in the browser - don't create admin client
//  console.warn('Admin client not available in browser environment')
}

// Export admin client (will be null in browser)
export { supabaseAdmin }

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
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not available' } }
    }

    const { data, error } = await (supabaseAdmin as SupabaseClient)
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()

    return { data, error }
  },

  // Update user profile (admin operations)
  updateUserProfile: async (userId: string, updates: any) => {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not available' } }
    }

    const { data, error } = await (supabaseAdmin as SupabaseClient)
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Delete user profile (admin operations)
  deleteUserProfile: async (userId: string) => {
    if (!supabaseAdmin) {
      return { error: { message: 'Admin client not available' } }
    }

    const { error } = await (supabaseAdmin as SupabaseClient)
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    return { error }
  }
}