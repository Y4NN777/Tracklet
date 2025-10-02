import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/financial-calculations'

export interface NotificationPreferences {
  budgetAlerts: {
    enabled: boolean
    thresholds: number[]
  }
  goalReminders: {
    enabled: boolean
    frequency: string
    daysBeforeDeadline: number
  }
  transactionAlerts: {
    enabled: boolean
    minAmount: number
    unusualSpending: boolean
  }
  emailNotifications: {
    enabled: boolean
    digest: string
  }
}

/**
 * Check budget alerts for a user
 * Creates notifications when budget spending exceeds thresholds
 */
export async function checkBudgetAlerts(userId: string) {
  try {
    // Get user preferences
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
//      console.error('Error fetching user preferences:', profileError)
      return
    }

    const preferences: NotificationPreferences = profile.preferences?.notifications
    if (!preferences?.budgetAlerts?.enabled) {
      return // Budget alerts disabled
    }

    const thresholds = preferences.budgetAlerts.thresholds || [80, 90, 100]
    const userCurrency = profile.preferences?.currency || 'XOF'

    // Get all budgets for the user
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select(`
        id,
        name,
        amount,
        period,
        start_date,
        end_date,
        category_id,
        categories (
          id,
          name
        )
      `)
      .eq('user_id', userId)

    if (budgetsError) {
//      console.error('Error fetching budgets:', budgetsError)
      return
    }

    for (const budget of budgets) {
      // Calculate current spending for this budget
      const spent = await calculateBudgetSpending(userId, budget)

      const percentage = (spent / budget.amount) * 100

      // Check each threshold
      for (const threshold of thresholds) {
        if (percentage >= threshold) {
          // Check if notification already exists for this budget and threshold
          const exists = await checkDuplicateAlert(userId, 'budget_alert', {
            budget_id: budget.id,
            threshold
          })

          if (!exists) {
            // Create notification
            await createNotification(userId, 'budget_alert', {
              title: `Budget Alert: ${budget.name}`,
              message: `You've spent ${percentage.toFixed(1)}% of your ${budget.name} budget (${formatCurrency(spent, userCurrency)} / ${formatCurrency(budget.amount, userCurrency)})`,
              data: {
                budget_id: budget.id,
                threshold,
                spent,
                amount: budget.amount,
                percentage
              },
              action_url: `/budgets/${budget.id}`,
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            })
          }
        }
      }
    }
  } catch (error) {
//    console.error('Error in checkBudgetAlerts:', error)
  }
}

/**
 * Check goal reminders for a user
 * Creates notifications for upcoming goal deadlines
 */
export async function checkGoalReminders(userId: string) {
  try {
    // Get user preferences
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
//      console.error('Error fetching user preferences:', profileError)
      return
    }

    const preferences: NotificationPreferences = profile.preferences?.notifications
    if (!preferences?.goalReminders?.enabled) {
      return // Goal reminders disabled
    }

    const daysBefore = preferences.goalReminders.daysBeforeDeadline || 7
    const frequency = preferences.goalReminders.frequency || 'weekly'

    // Get all goals with target dates
    const { data: goals, error: goalsError } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .not('target_date', 'is', null)

    if (goalsError) {
//      console.error('Error fetching goals:', goalsError)
      return
    }

    const now = new Date()
    const reminderDate = new Date(now.getTime() + daysBefore * 24 * 60 * 60 * 1000)

    for (const goal of goals) {
      const targetDate = new Date(goal.target_date)
      const progress = (goal.current_amount / goal.target_amount) * 100

      // Check if deadline is approaching
      if (targetDate <= reminderDate && targetDate >= now) {
        // Check frequency - for now, only send if not sent in the last week
        const exists = await checkDuplicateAlert(userId, 'goal_reminder', {
          goal_id: goal.id,
          type: 'deadline_approaching'
        }, 7 * 24 * 60 * 60 * 1000) // 7 days

        if (!exists) {
          await createNotification(userId, 'goal_reminder', {
            title: `Goal Reminder: ${goal.name}`,
            message: `Your savings goal "${goal.name}" is due in ${Math.ceil((targetDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))} days. You're ${progress.toFixed(1)}% there.`,
            data: {
              goal_id: goal.id,
              target_date: goal.target_date,
              current_amount: goal.current_amount,
              target_amount: goal.target_amount,
              progress
            },
            action_url: `/savings/${goal.id}`,
            expires_at: goal.target_date
          })
        }
      }

      // Weekly progress reminders if frequency is weekly
      if (frequency === 'weekly') {
        const exists = await checkDuplicateAlert(userId, 'goal_reminder', {
          goal_id: goal.id,
          type: 'weekly_progress'
        }, 7 * 24 * 60 * 60 * 1000) // 7 days

        if (!exists && progress < 100) {
          await createNotification(userId, 'goal_reminder', {
            title: `Weekly Goal Update: ${goal.name}`,
            message: `You're ${progress.toFixed(1)}% towards your "${goal.name}" goal. Keep saving!`,
            data: {
              goal_id: goal.id,
              current_amount: goal.current_amount,
              target_amount: goal.target_amount,
              progress,
              type: 'weekly_progress'
            },
            action_url: `/savings/${goal.id}`,
            expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }
    }
  } catch (error) {
//    console.error('Error in checkGoalReminders:', error)
  }
}

/**
 * Check transaction alerts for a user
 * Creates notifications for large or unusual transactions
 */
export async function checkTransactionAlerts(userId: string, transactionId?: string) {
  try {
    // Get user preferences
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
//      console.error('Error fetching user preferences:', profileError)
      return
    }

    const preferences: NotificationPreferences = profile.preferences?.notifications
    if (!preferences?.transactionAlerts?.enabled) {
      return // Transaction alerts disabled
    }

    const minAmount = preferences.transactionAlerts.minAmount || 100
    const unusualEnabled = preferences.transactionAlerts.unusualSpending
    const userCurrency = profile.preferences?.currency || 'XOF'

    // Get the transaction(s) to check
    let query = supabase
      .from('transactions')
      .select(`
        id,
        amount,
        description,
        type,
        date,
        categories (
          name
        ),
        accounts (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('type', 'expense')

    if (transactionId) {
      query = query.eq('id', transactionId)
    } else {
      // For background job, check recent transactions (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      query = query.gte('created_at', oneHourAgo)
    }

    const { data: transactions, error: txError } = await query

    if (txError) {
//      console.error('Error fetching transactions:', txError)
      return
    }

    for (const transaction of transactions) {
      // Check minimum amount threshold
      if (transaction.amount >= minAmount) {
        const exists = await checkDuplicateAlert(userId, 'transaction_alert', {
          transaction_id: transaction.id,
          type: 'large_amount'
        })

        if (!exists) {
          await createNotification(userId, 'transaction_alert', {
            title: `Large Transaction Alert`,
            message: `You made a ${formatCurrency(transaction.amount, userCurrency)} expense: "${transaction.description}"`,
            data: {
              transaction_id: transaction.id,
              amount: transaction.amount,
              description: transaction.description,
              type: 'large_amount'
            },
            action_url: `/transactions/${transaction.id}`,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          })
        }
      }

      // Check for unusual spending if enabled
      if (unusualEnabled) {
        const isUnusual = await detectUnusualSpending(userId, transaction)
        if (isUnusual) {
          const exists = await checkDuplicateAlert(userId, 'transaction_alert', {
            transaction_id: transaction.id,
            type: 'unusual_spending'
          })

          if (!exists) {
            await createNotification(userId, 'transaction_alert', {
              title: `Unusual Spending Detected`,
              message: `Unusual expense of ${formatCurrency(transaction.amount, userCurrency)} for "${transaction.description}" in ${(transaction.categories as any)?.name || 'Uncategorized'}`,
              data: {
                transaction_id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                category: (transaction.categories as any)?.name,
                type: 'unusual_spending'
              },
              action_url: `/transactions/${transaction.id}`,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            })
          }
        }
      }
    }
  } catch (error) {
//    console.error('Error in checkTransactionAlerts:', error)
  }
}

/**
 * Calculate current spending for a budget
 */
async function calculateBudgetSpending(userId: string, budget: any): Promise<number> {
  const { start_date, end_date, id: budgetId, name: budgetName } = budget

  console.log(`Calculating spending for budget ${budgetId} (${budgetName}): start=${start_date}, end=${end_date}`)

  if (!budgetId) {
    console.warn(`Budget has no ID, cannot calculate spending`)
    return 0
  }

  let query = supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .eq('budget_id', budgetId)
    .gte('date', start_date)

  if (end_date) {
    query = query.lte('date', end_date)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error calculating budget spending:', error)
    return 0
  }

  const total = data.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
  console.log(`Budget ${budgetId} spending: ${total} from ${data.length} transactions`)

  return total
}

/**
 * Detect unusual spending patterns
 */
async function detectUnusualSpending(userId: string, transaction: any): Promise<boolean> {
  try {
    // Get user's average spending for the same category over the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let query = supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', thirtyDaysAgo)

    if (transaction.category_id) {
      query = query.eq('category_id', transaction.category_id)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return false // Not enough data to determine unusual
    }

    const amounts = data.map(tx => parseFloat(tx.amount))
    const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
    const stdDev = Math.sqrt(
      amounts.reduce((sum, amt) => sum + Math.pow(amt - average, 2), 0) / amounts.length
    )

    // Consider unusual if amount is more than 2 standard deviations above average
    // or if it's in the top 10% of transactions
    const isOutlier = transaction.amount > average + 2 * stdDev
    const sortedAmounts = [...amounts].sort((a, b) => b - a)
    const percentile90 = sortedAmounts[Math.floor(sortedAmounts.length * 0.1)]
    const isHighPercentile = transaction.amount >= percentile90

    return isOutlier || isHighPercentile
  } catch (error) {
//    console.error('Error detecting unusual spending:', error)
    return false
  }
}

/**
 * Check if a duplicate alert already exists
 */
async function checkDuplicateAlert(
  userId: string,
  type: string,
  data: any,
  timeWindow: number = 24 * 60 * 60 * 1000 // 24 hours default
): Promise<boolean> {
  try {
    const since = new Date(Date.now() - timeWindow).toISOString()

    const { data: typeData, error: typeError } = await supabase
      .from('notification_types')
      .select('id')
      .eq('name', type)
      .single()

    if (typeError || !typeData) {
      return false
    }

    // Build query with field-specific conditions instead of JSON containment
    let query = supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('type_id', typeData.id)
      .gte('created_at', since)

    // Add field-specific conditions based on notification type
    if (type === 'budget_alert') {
      query = query
        .eq('data->>budget_id', data.budget_id?.toString())
        .eq('data->>threshold', data.threshold?.toString())
    } else if (type === 'goal_reminder') {
      query = query
        .eq('data->>goal_id', data.goal_id?.toString())
        .eq('data->>type', data.type)
    } else if (type === 'transaction_alert') {
      query = query
        .eq('data->>transaction_id', data.transaction_id?.toString())
        .eq('data->>type', data.type)
    }

    const { data: existing, error } = await query.limit(1)

    return !error && existing && existing.length > 0
  } catch (error) {
//    console.error('Error checking duplicate alert:', error)
    return false
  }
}

/**
 * Create a notification
 */
async function createNotification(
  userId: string,
  type: string,
  notification: {
    title: string
    message?: string
    data?: any
    action_url?: string
    expires_at?: string
  }
) {
  try {
    // Check for duplicates before creating
    const isDuplicate = await checkDuplicateAlert(userId, type, notification.data)

    if (isDuplicate) {
      console.log(`Duplicate ${type} notification prevented for user ${userId}`)
      return
    }

    // Get notification type ID
    const { data: typeData, error: typeError } = await supabase
      .from('notification_types')
      .select('id')
      .eq('name', type)
      .single()

    if (typeError || !typeData) {
//      console.error('Invalid notification type:', type)
      return
    }

    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type_id: typeData.id,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        action_url: notification.action_url,
        expires_at: notification.expires_at
      }])

    if (error) {
//      console.error('Error creating notification:', error)
    }
  } catch (error) {
//    console.error('Error in createNotification:', error)
  }
}