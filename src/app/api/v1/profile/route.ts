import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/v1/profile - Get current user profile with preferences
export async function GET(request: NextRequest) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Validate token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
//      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ profile: data })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/v1/profile - Update user profile and preferences
export async function PATCH(request: NextRequest) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Validate token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      full_name,
      avatar_url,
      preferences,
      terms_accepted,
      terms_accepted_at,
      onboarding_step,
      onboarding_completed,
      onboarding_completed_at
    } = body

    // Build update object with only provided fields
    const updateData: any = {}
    if (full_name !== undefined) updateData.full_name = full_name
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (preferences !== undefined) updateData.preferences = preferences
    if (terms_accepted !== undefined) updateData.terms_accepted = terms_accepted
    if (terms_accepted_at !== undefined) updateData.terms_accepted_at = terms_accepted_at
    if (onboarding_step !== undefined) updateData.onboarding_step = onboarding_step
    if (onboarding_completed !== undefined) updateData.onboarding_completed = onboarding_completed
    if (onboarding_completed_at !== undefined) updateData.onboarding_completed_at = onboarding_completed_at

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
//      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      profile: data,
      message: 'Profile updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}