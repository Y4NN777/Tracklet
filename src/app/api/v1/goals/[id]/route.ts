import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/goals/[id] - Get a specific savings goal
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
    const { searchParams } = new URL(request.url)
    const includeProgress = searchParams.get('include_progress') === 'true'

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }
      console.error('Error fetching goal:', error)
      return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 })
    }

    // Calculate progress if requested
    if (includeProgress) {
      const progress = await calculateGoalProgress(data, user.id)
      return NextResponse.json({ goal: { ...data, ...progress } })
    }

    return NextResponse.json({ goal: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/goals/[id] - Partially update a savings goal (RECOMMENDED)
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
    const { name, target_amount, current_amount, target_date, description } = body

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (target_amount !== undefined) updateData.target_amount = parseFloat(target_amount)
    if (current_amount !== undefined) updateData.current_amount = parseFloat(current_amount)
    if (target_date !== undefined) updateData.target_date = target_date
    if (description !== undefined) updateData.description = description

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }
      console.error('Error updating goal:', error)
      return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
    }

    return NextResponse.json({
      goal: data,
      message: 'Goal updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/goals/[id] - Replace entire savings goal (ADMIN/BULK)
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
    const { name, target_amount, current_amount, target_date, description } = body

    // PUT requires ALL required fields
    if (!name || !target_amount) {
      return NextResponse.json({
        error: 'PUT requires all fields: name, target_amount'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .update({
        name,
        target_amount: parseFloat(target_amount),
        current_amount: parseFloat(current_amount || 0),
        target_date,
        description
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      }
      console.error('Error replacing goal:', error)
      return NextResponse.json({ error: 'Failed to replace goal' }, { status: 500 })
    }

    return NextResponse.json({
      goal: data,
      message: 'Goal replaced successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/goals/[id] - Delete a savings goal
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
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting goal:', error)
      return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Goal deleted successfully' })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to calculate goal progress
async function calculateGoalProgress(goal: any, userId: string) {
  // For now, we'll just return the current progress
  // In a real implementation, you might want to calculate this based on transactions
  // or have a separate table for goal contributions

  const currentAmount = goal.current_amount || 0
  const targetAmount = goal.target_amount
  const remaining = targetAmount - currentAmount
  const percentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0

  return {
    remaining,
    percentage: Math.round(percentage * 100) / 100,
    is_completed: currentAmount >= targetAmount,
    days_remaining: goal.target_date ?
      Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) :
      null
  }
}