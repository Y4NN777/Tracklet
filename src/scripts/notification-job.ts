#!/usr/bin/env tsx

/**
 * Notification Background Job
 *
 * This script runs periodically to check and create notifications for all users.
 * Run this script every hour using a cron job or scheduler.
 *
 * Usage:
 * - Development: npm run notification-job
 * - Production: Set up cron job to run every hour
 */

import { supabase } from '@/lib/supabase'
import { checkBudgetAlerts, checkGoalReminders, checkTransactionAlerts } from '@/lib/actions/notifications'

async function runNotificationJob() {
//  console.log('Starting notification background job...')

  try {
    // Get all user IDs
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('onboarding_completed', true) // Only active users

    if (error) {
//      console.error('Error fetching users:', error)
      return
    }

//    console.log(`Processing notifications for ${users.length} users...`)

    // Process each user
    for (const user of users) {
      try {
//        console.log(`Processing user ${user.id}...`)

        // Run all notification checks
        await Promise.all([
          checkBudgetAlerts(user.id),
          checkGoalReminders(user.id),
          checkTransactionAlerts(user.id) // Check recent transactions
        ])

//        console.log(`Completed processing for user ${user.id}`)
      } catch (userError) {
//        console.error(`Error processing user ${user.id}:`, userError)
        // Continue with next user
      }
    }

//    console.log('Notification background job completed successfully')
  } catch (error) {
//    console.error('Error in notification job:', error)
    process.exit(1)
  }
}

// Run the job if this script is executed directly
if (require.main === module) {
  runNotificationJob()
    .then(() => {
//      console.log('Job finished')
      process.exit(0)
    })
    .catch((error) => {
//      console.error('Job failed:', error)
      process.exit(1)
    })
}

export { runNotificationJob }