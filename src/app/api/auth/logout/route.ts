import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/supabase'

// POST /api/auth/logout - Logout endpoint
export async function POST(request: NextRequest) {
  try {
    const { error } = await auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Logged out successfully',
      success: true
    })

  } catch (error) {
    console.error('Unexpected logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/auth/logout - Alternative logout method for direct links
export async function GET(request: NextRequest) {
  try {
    const { error } = await auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // Redirect to login with error
      return NextResponse.redirect(new URL('/login?error=logout_failed', request.url))
    }

    // Redirect to login page after successful logout
    return NextResponse.redirect(new URL('/login?message=logged_out', request.url))

  } catch (error) {
    console.error('Unexpected logout error:', error)
    return NextResponse.redirect(new URL('/login?error=logout_error', request.url))
  }
}