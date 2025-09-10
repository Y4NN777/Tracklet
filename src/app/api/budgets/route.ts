import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/budgets - Get all budgets for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeProgress = searchParams.get('include_progress') === 'true'

    let query = supabase
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
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    const { data: budgets, error } = await query

    if (error) {
      console.error('Error fetching budgets:', error)
      return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
    }

    // Calculate progress for each budget if requested
    if (includeProgress && budgets) {
      const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
          const progress = await calculateBudgetProgress(budget, session.user.id)
          return { ...budget, ...progress }
        })
      )
      return NextResponse.json({ budgets: budgetsWithProgress })
    }

    return NextResponse.json({ budgets })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, amount, period, category_id, start_date, end_date } = body

    // Validate required fields
    if (!name || !amount || !period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate period
    if (!['monthly', 'weekly', 'yearly'].includes(period)) {
      return NextResponse.json({ error: 'Invalid budget period' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        user_id: session.user.id,
        name,
        amount: parseFloat(amount),
        period,
        category_id,
        start_date,
        end_date
      }])
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
      console.error('Error creating budget:', error)
      return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
    }

    return NextResponse.json({ budget: data }, { status: 201 })

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