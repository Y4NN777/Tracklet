import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runNotificationJob } from '@/scripts/notification-job'

// POST /api/v1/notifications/trigger - Trigger notification checks for all users
// This endpoint can be called by cron jobs or manually for testing
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication or API key validation for security
    // For now, allowing unauthenticated access for cron jobs

    // Optional: Check for a secret key in headers
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.NOTIFICATION_JOB_SECRET

    if (expectedKey && (!authHeader || authHeader !== `Bearer ${expectedKey}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Run the notification job
    await runNotificationJob()

    return NextResponse.json({
      message: 'Notification job completed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
//    console.error('Error running notification job:', error)
    return NextResponse.json({
      error: 'Failed to run notification job',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET /api/v1/notifications/trigger - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Notification trigger endpoint is active',
    timestamp: new Date().toISOString(),
    usage: 'POST to this endpoint to trigger notification checks for all users'
  })
}