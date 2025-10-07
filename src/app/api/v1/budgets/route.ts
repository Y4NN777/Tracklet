import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateBudgetProgress } from '@/lib/financial-calculations'

// GET /api/budgets - Get all budgets for the authenticated user
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const { data: budgets, error } = await query

    if (error) {
//      console.error('Error fetching budgets:', error)
      return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
    }

    // Calculate progress for each budget if requested
    if (includeProgress && budgets) {
      const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
          const progress = await calculateBudgetProgress(budget.id, user.id)
          if (progress) {
            // Transform BudgetProgress to embedded format for API compatibility
            const p = progress as any // Type assertion to avoid TypeScript confusion
            return {
              ...budget,
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
          }
          // Return budget without progress if calculation failed
          return {
            ...budget,
            spent: 0,
            remaining: budget.amount,
            percentage: 0,
            is_over_budget: false
          }
        })
      )
      return NextResponse.json({ budgets: budgetsWithProgress })
    }

    return NextResponse.json({ budgets })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/budgets - Create a new budget
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
        user_id: user.id,
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
//      console.error('Error creating budget:', error)
      return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
    }

    return NextResponse.json({ budget: data }, { status: 201 })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
