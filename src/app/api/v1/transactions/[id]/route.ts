import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/transactions/[id] - Get a specific transaction
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
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon
        ),
        accounts (
          id,
          name,
          type
        ),
        budgets (
          id,
          name
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
//      console.error('Error fetching transaction:', error)
      return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 })
    }

    return NextResponse.json({ transaction: data })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/transactions/[id] - Partially update a transaction (RECOMMENDED)
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
    const { amount, description, type, date, category_id, account_id, budget_id } = body

    // Validate transaction type if provided
    if (type && !['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    // Validate category_id if provided
    if (category_id) {
      // console.log('Validating category_id:', category_id)
      const { data: categoryExists, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', category_id)
        .eq('user_id', user.id)
        .single()

      if (categoryError || !categoryExists) {
        // console.error('Category validation failed:', { categoryError, categoryExists, category_id })
        return NextResponse.json({
          error: 'Selected category does not exist or is not accessible'
        }, { status: 400 })
      }
      // console.log('Category validation passed:', categoryExists)
    }

    // Validate account_id if provided
    if (account_id) {
      // console.log('Validating account_id:', account_id)
      const { data: accountExists, error: accountError } = await supabase
        .from('accounts')
        .select('id, name')
        .eq('id', account_id)
        .eq('user_id', user.id)
        .single()

      if (accountError || !accountExists) {
        // console.error('Account validation failed:', { accountError, accountExists, account_id })
        return NextResponse.json({
          error: 'Selected account does not exist or is not accessible'
        }, { status: 400 })
      }
      // console.log('Account validation passed:', accountExists)
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (date !== undefined) updateData.date = date
    if (category_id !== undefined && category_id !== '') updateData.category_id = category_id || null
    if (account_id !== undefined && account_id !== '') updateData.account_id = account_id || null
    if (budget_id !== undefined && budget_id !== '') updateData.budget_id = budget_id || null

    // console.log('Update data prepared:', updateData)

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('transactions')
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
        ),
        accounts (
          id,
          name,
          type
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }

      // Check for foreign key constraint violations
      if (error.code === '23503') {
        return NextResponse.json({
          error: 'Invalid reference - the selected category or account may not exist'
        }, { status: 400 })
      }

      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
    }

    return NextResponse.json({
      transaction: data,
      message: 'Transaction updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/transactions/[id] - Replace entire transaction (ADMIN/BULK)
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
    const { amount, description, type, date, category_id, account_id, budget_id } = body

    // PUT requires ALL required fields
    if (!amount || !description || !type || !date) {
      return NextResponse.json({
        error: 'PUT requires all fields: amount, description, type, date'
      }, { status: 400 })
    }

    // Validate transaction type
    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount: parseFloat(amount),
        description,
        type,
        date,
        category_id,
        account_id,
        budget_id: budget_id || null
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
        ),
        accounts (
          id,
          name,
          type
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
//      console.error('Error replacing transaction:', error)
      return NextResponse.json({ error: 'Failed to replace transaction' }, { status: 500 })
    }

    return NextResponse.json({
      transaction: data,
      message: 'Transaction replaced successfully'
    })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
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
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
//      console.error('Error deleting transaction:', error)
      return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' })

  } catch (error) {
//    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}