import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/budgets/[id] - Get a specific budget
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
      }
      console.error('Error fetching budget:', error)
      return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 })
    }

    // Calculate progress if requested
    if (includeProgress) {
      const progress = await calculateBudgetProgress(data, session.user.id)
      return NextResponse.json({ budget: { ...data, ...progress } })
    }

    return NextResponse.json({ budget: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/budgets/[id] - Partially update a budget (RECOMMENDED)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      .eq('id', params.id)
      .eq('user_id', session.user.id)
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
      console.error('Error updating budget:', error)
      return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
    }

    return NextResponse.json({
      budget: data,
      message: 'Budget updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/budgets/[id] - Replace entire budget (ADMIN/BULK)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      .eq('id', params.id)
      .eq('user_id', session.user.id)
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
      console.error('Error replacing budget:', error)
      return NextResponse.json({ error: 'Failed to replace budget' }, { status: 500 })
    }

    return NextResponse.json({
      budget: data,
      message: 'Budget replaced successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error deleting budget:', error)
      return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Budget deleted successfully' })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to calculate budget progress
async function calculateBudgetProgress(budget: any, userId: string) {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .eq('category_id', budget.category_id)
    .gte('date', budget.start_date)
    .lte('date', budget.end_date || new Date().toISOString().split('T')[0])

  if (error) {
    console.error('Error calculating budget progress:', error)
    return { spent: 0, remaining: budget.amount, percentage: 0 }
  }

  const spent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0
  const remaining = budget.amount - spent
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

  return {
    spent,
    remaining,
    percentage: Math.round(percentage * 100) / 100,
    is_over_budget: spent > budget.amount
  }
}