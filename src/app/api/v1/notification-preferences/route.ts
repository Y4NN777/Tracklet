import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/v1/notification-preferences - Get notification preferences for the authenticated user
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
      .select('preferences')
      .eq('id', user.id)
      .single()

    if (error) {
//      console.error('Error fetching notification preferences:', error)
      return NextResponse.json({ error: 'Failed to fetch notification preferences' }, { status: 500 })
    }

    const preferences = data?.preferences || {}
    const notificationPreferences = preferences.notifications || {}

    return NextResponse.json({
      notificationPreferences
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/v1/notification-preferences - Update notification preferences
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
    const { budgetAlerts, goalReminders, transactionAlerts, emailNotifications } = body

    // Validate that at least one preference field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    // Get current preferences
    const { data: currentData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single()

    if (fetchError) {
//      console.error('Error fetching current preferences:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch current preferences' }, { status: 500 })
    }

    const currentPreferences = currentData?.preferences || {}
    const currentNotifications = currentPreferences.notifications || {}

    // Merge updates with current notifications
    const updatedNotifications = {
      ...currentNotifications,
      ...(budgetAlerts !== undefined && { budgetAlerts }),
      ...(goalReminders !== undefined && { goalReminders }),
      ...(transactionAlerts !== undefined && { transactionAlerts }),
      ...(emailNotifications !== undefined && { emailNotifications })
    }

    // Update the preferences JSONB field
    const updatedPreferences = {
      ...currentPreferences,
      notifications: updatedNotifications
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ preferences: updatedPreferences })
      .eq('id', user.id)
      .select('preferences')
      .single()

    if (error) {
//      console.error('Error updating notification preferences:', error)
      return NextResponse.json({ error: 'Failed to update notification preferences' }, { status: 500 })
    }

    const updatedFields = Object.keys(body)

    return NextResponse.json({
      notificationPreferences: data.preferences.notifications,
      message: 'Notification preferences updated successfully',
      updatedFields
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}