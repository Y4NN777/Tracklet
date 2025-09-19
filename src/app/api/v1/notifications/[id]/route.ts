import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH /api/v1/notifications/[id] - Update a notification
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { read, title, message, data: notificationData, action_url, expires_at } = body

    // Validate that at least one field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    // Check if notification exists and belongs to user
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (read !== undefined) {
      updateData.read_at = read ? new Date().toISOString() : null
    }

    if (title !== undefined) updateData.title = title
    if (message !== undefined) updateData.message = message
    if (notificationData !== undefined) updateData.data = notificationData
    if (action_url !== undefined) updateData.action_url = action_url
    if (expires_at !== undefined) {
      updateData.expires_at = expires_at ? new Date(expires_at).toISOString() : null
    }

    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        notification_types (
          name,
          display_name,
          description,
          icon,
          color,
          priority
        )
      `)
      .single()

    if (error) {
//      console.error('Error updating notification:', error)
      return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
    }

    const updatedFields = Object.keys(updateData)

    return NextResponse.json({
      notification: data,
      message: 'Notification updated successfully',
      updatedFields
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/v1/notifications/[id] - Delete a notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if notification exists and belongs to user
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
//      console.error('Error deleting notification:', error)
      return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notification deleted successfully'
    }, { status: 204 })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}