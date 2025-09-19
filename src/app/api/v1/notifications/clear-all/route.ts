import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// DELETE /api/v1/notifications/clear-all - Delete all notifications for the user
export async function DELETE(request: NextRequest) {
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

    // Get count of notifications before deletion
    const { count: beforeCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Delete all notifications for the user
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)

    if (error) {
//      console.error('Error clearing notifications:', error)
      return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 })
    }

    return NextResponse.json({
      message: `Cleared ${beforeCount || 0} notifications`,
      clearedCount: beforeCount || 0
    }, { status: 200 })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}