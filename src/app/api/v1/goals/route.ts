import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/goals - Get all savings goals for the authenticated user
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
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const { data: goals, error } = await query

    if (error) {
      console.error('Error fetching goals:', error)
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
    }

    // Calculate progress for each goal if requested
    if (includeProgress && goals) {
      const goalsWithProgress = await Promise.all(
        goals.map(async (goal) => {
          const progress = await calculateGoalProgress(goal, user.id)
          return { ...goal, ...progress }
        })
      )
      return NextResponse.json({ goals: goalsWithProgress })
    }

    return NextResponse.json({ goals })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/goals - Create a new savings goal
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
    const { name, target_amount, current_amount, target_date, description } = body

    // Validate required fields
    if (!name || !target_amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{
        user_id: user.id,
        name,
        target_amount: parseFloat(target_amount),
        current_amount: parseFloat(current_amount || 0),
        target_date,
        description
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
    }

    return NextResponse.json({ goal: data }, { status: 201 })

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