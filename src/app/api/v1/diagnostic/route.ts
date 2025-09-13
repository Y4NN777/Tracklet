import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: connectionError
      }, { status: 500 })
    }

    // Test table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    if (tableError && tableError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return NextResponse.json({
        status: 'error',
        message: 'Table structure issue',
        error: tableError
      }, { status: 500 })
    }

    // Test profile creation with minimal data
    const testUserId = '550e8400-e29b-41d4-a716-446655440000' // Valid UUID format
    const { data: testProfile, error: testError } = await supabase
      .from('user_profiles')
      .insert([{
        id: testUserId,
        email: 'test@example.com',
        full_name: 'Test User',
        preferences: { theme: 'system' },
        onboarding_step: 0,
        onboarding_completed: false,
        terms_accepted: false
      }])
      .select()

    // Clean up test data
    if (testProfile) {
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testUserId)
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database diagnostic completed',
      data: {
        connection: 'OK',
        tableStructure: tableInfo ? 'OK' : 'Empty table',
        profileCreation: testError ? 'FAILED' : 'OK',
        testError: testError || null
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during diagnostic',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}