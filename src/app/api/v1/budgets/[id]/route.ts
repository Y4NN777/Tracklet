import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateBudgetProgress } from '@/lib/financial-calculations'

// GET /api/budgets/[id] - Get a specific budget
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
      .from('budgets')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
      }
//      console.error('Error fetching budget:', error)
      return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 })
    }

    // Calculate progress if requested
    if (includeProgress) {
      const progress = await calculateBudgetProgress(id, user.id)
      if (progress) {
        // Transform BudgetProgress to embedded format for API compatibility
        const p = progress as any // Type assertion to avoid TypeScript confusion
        return NextResponse.json({
          budget: {
            ...data,
            spent: p.spent,
            remaining: p.remaining,
            percentage: p.percentage,
            is_over_budget: p.isOverBudget,
            // Include enhanced metrics
            spending_velocity: p.spendingVelocity,
            projected_overspend_date: p.projectedOverspendDate,
            days_remaining: p.daysRemaining,
            period_comparison: p.periodComparison
          }
        })
      }
      // Return budget without progress if calculation failed
      return NextResponse.json({
        budget: {
          ...data,
          spent: 0,
          remaining: data.amount,
          percentage: 0,
          is_over_budget: false
        }
      })
    }

    return NextResponse.json({ budget: data })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/budgets/[id] - Partially update a budget (RECOMMENDED)
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
    const { name, amount, period, category_id, start_date, end_date } = body

    // Validate period if provided
    if (period && !['monthly', 'weekly', 'yearly'].includes(period)) {
      return NextResponse.json({ error: 'Invalid budget period' }, { status: 400 })
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (period !== undefined) updateData.period = period
    if (category_id !== undefined) updateData.category_id = category_id
    if (start_date !== undefined) updateData.start_date = start_date
    if (end_date !== undefined) updateData.end_date = end_date

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
      }
//      console.error('Error updating budget:', error)
      return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
    }

    return NextResponse.json({
      budget: data,
      message: 'Budget updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/budgets/[id] - Replace entire budget (ADMIN/BULK)
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
    const { name, amount, period, category_id, start_date, end_date } = body

    // PUT requires ALL required fields
    if (!name || !amount || !period) {
      return NextResponse.json({
        error: 'PUT requires all fields: name, amount, period'
      }, { status: 400 })
    }

    // Validate period
    if (!['monthly', 'weekly', 'yearly'].includes(period)) {
      return NextResponse.json({ error: 'Invalid budget period' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({
        name,
        amount: parseFloat(amount),
        period,
        category_id,
        start_date,
        end_date
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
      }
//      console.error('Error replacing budget:', error)
      return NextResponse.json({ error: 'Failed to replace budget' }, { status: 500 })
    }

    return NextResponse.json({
      budget: data,
      message: 'Budget replaced successfully'
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/budgets/[id] - Delete a budget
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

    // First, remove budget assignment from transactions to avoid foreign key constraint
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ budget_id: null })
      .eq('budget_id', id)
      .eq('user_id', user.id)

    if (updateError) {
//      console.error('Error updating transactions:', updateError)
      return NextResponse.json({ error: 'Failed to unassign transactions from budget' }, { status: 500 })
    }

    // Now delete the budget
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
//      console.error('Error deleting budget:', error)
      return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Budget deleted successfully' })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
