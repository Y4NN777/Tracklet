import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/accounts/[id] - Get a specific account
export async function GET(
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
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      }
      console.error('Error fetching account:', error)
      return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
    }

    return NextResponse.json({ account: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/accounts/[id] - Partially update an account (RECOMMENDED)
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
    const { name, type, balance, currency } = body

    // Validate account type if provided
    if (type && !['checking', 'savings', 'credit', 'investment'].includes(type)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 })
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (balance !== undefined) updateData.balance = parseFloat(balance)
    if (currency !== undefined) updateData.currency = currency

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      }
      console.error('Error updating account:', error)
      return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
    }

    return NextResponse.json({
      account: data,
      message: 'Account updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/accounts/[id] - Replace entire account (ADMIN/BULK)
export async function PUT(
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
    const { name, type, balance, currency } = body

    // PUT requires ALL required fields
    if (!name || !type) {
      return NextResponse.json({
        error: 'PUT requires all fields: name, type'
      }, { status: 400 })
    }

    // Validate account type
    if (!['checking', 'savings', 'credit', 'investment'].includes(type)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('accounts')
      .update({
        name,
        type,
        balance: parseFloat(balance || 0),
        currency: currency || 'USD'
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      }
      console.error('Error replacing account:', error)
      return NextResponse.json({ error: 'Failed to replace account' }, { status: 500 })
    }

    return NextResponse.json({
      account: data,
      message: 'Account replaced successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/accounts/[id] - Delete an account
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
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting account:', error)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Account deleted successfully' })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}