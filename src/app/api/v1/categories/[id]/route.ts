import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      console.error('Error fetching category:', error)
      return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
    }

    return NextResponse.json({ category: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/categories/[id] - Partially update a category (RECOMMENDED)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, type, color, icon } = body

    // Validate category type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid category type' }, { status: 400 })
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon

    // Check if any fields were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      console.error('Error updating category:', error)
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

    return NextResponse.json({
      category: data,
      message: 'Category updated successfully',
      updatedFields: Object.keys(updateData)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Replace entire category (ADMIN/BULK)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, type, color, icon } = body

    // PUT requires ALL required fields
    if (!name || !type) {
      return NextResponse.json({
        error: 'PUT requires all fields: name, type'
      }, { status: 400 })
    }

    // Validate category type
    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid category type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        name,
        type,
        color: color || '#6366f1',
        icon: icon || '📊'
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      console.error('Error replacing category:', error)
      return NextResponse.json({ error: 'Failed to replace category' }, { status: 500 })
    }

    return NextResponse.json({
      category: data,
      message: 'Category replaced successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}