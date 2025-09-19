import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/v1/notifications - Get all notifications for the authenticated user with pagination
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Max 100
    const offset = parseInt(searchParams.get('offset') || '0')
    const read = searchParams.get('read') // 'true', 'false', or null for all
    const type = searchParams.get('type') // notification type name

    // Build query
    let query = supabase
      .from('notifications')
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by read status
    if (read === 'true') {
      query = query.not('read_at', 'is', null)
    } else if (read === 'false') {
      query = query.is('read_at', null)
    }

    // Filter by type if specified
    if (type) {
      // First get the type ID
      const { data: typeData, error: typeError } = await supabase
        .from('notification_types')
        .select('id')
        .eq('name', type)
        .single()

      if (typeError || !typeData) {
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
      }

      query = query.eq('type_id', typeData.id)
    }

    const { data, error } = await query

    if (error) {
//      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    // Get total count for pagination info
    let countQuery = supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (read === 'true') {
      countQuery = countQuery.not('read_at', 'is', null)
    } else if (read === 'false') {
      countQuery = countQuery.is('read_at', null)
    }

    if (type) {
      // Get the type ID for count query
      const { data: typeData } = await supabase
        .from('notification_types')
        .select('id')
        .eq('name', type)
        .single()

      if (typeData) {
        countQuery = countQuery.eq('type_id', typeData.id)
      }
    }

    const { count } = await countQuery

    return NextResponse.json({
      notifications: data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/notifications - Create a new notification
export async function POST(request: NextRequest) {
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
    const { type, title, message, data: notificationData, action_url, expires_at } = body

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json({ error: 'Missing required fields: type and title' }, { status: 400 })
    }

    // Get notification type ID
    const { data: typeData, error: typeError } = await supabase
      .from('notification_types')
      .select('id')
      .eq('name', type)
      .single()

    if (typeError || !typeData) {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: user.id,
        type_id: typeData.id,
        title,
        message,
        data: notificationData || {},
        action_url,
        expires_at: expires_at ? new Date(expires_at).toISOString() : null
      }])
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
//      console.error('Error creating notification:', error)
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }

    return NextResponse.json({ notification: data }, { status: 201 })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}