import { supabase } from './supabase'
import {
  calculateFinancialSummary,
  calculateDailyFinancialSummary,
  calculateWeeklyFinancialSummary,
  calculateAccountBalance,
  invalidateBudgetProgress,
  FinancialSummary,
  DailyData,
  WeeklyData,
  BudgetProgress
} from './financial-calculations'
import { api } from './api-client'

// Interface for budget with progress data as returned by API
export interface BudgetWithProgress {
  id: string
  user_id: string
  name: string
  category_id: string | null
  amount: number
  spent: number
  period: string
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    color: string
    icon: string
  } | null
  // Progress fields
  remaining: number
  percentage: number
  is_over_budget: boolean
  // Enhanced progress metrics
  spending_velocity: number
  projected_overspend_date?: string
  days_remaining: number
  period_comparison?: number
}

export interface DashboardData {
  financialSummary: FinancialSummary | DailyData[] | WeeklyData[] | null
  timeGranularity: 'daily' | 'weekly' | 'monthly'
  budgets: BudgetWithProgress[]
  recentTransactions: any[]
  accounts: any[]
  netWorth: number
  totalSavings: number
  isLoading: boolean
  error: string | null
}

export interface DashboardMetrics {
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  totalSavings: number
  savingsRate: number
}

class DashboardService {
  private userId: string | null = null

  constructor() {
    this.initializeUser()
  }

  private async initializeUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      this.userId = session?.user?.id || null
    } catch (error) {
//      console.error('Failed to initialize user:', error)
    }
  }

  private async getFinancialDataForTimeFilter(timeFilter: 'daily' | 'weekly' | 'monthly') {
    if (!this.userId) return null

    switch (timeFilter) {
      case 'daily':
        return calculateDailyFinancialSummary(this.userId, 30) // Last 30 days
      case 'weekly':
        return calculateWeeklyFinancialSummary(this.userId, 12) // Last 12 weeks
      case 'monthly':
      default:
        return calculateFinancialSummary(this.userId, 6) // Last 6 months
    }
  }

  async getDashboardData(timeFilter: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<DashboardData> {
    if (!this.userId) {
      await this.initializeUser()
    }

    if (!this.userId) {
      return {
        financialSummary: null,
        timeGranularity: timeFilter,
        budgets: [],
        recentTransactions: [],
        accounts: [],
        netWorth: 0,
        totalSavings: 0,
        isLoading: false,
        error: 'User not authenticated'
      }
    }

    try {
      // Fetch all data in parallel
      const [
        financialSummary,
        budgetsResponse,
        transactionsResponse,
        accountsResponse
      ] = await Promise.allSettled([
        this.getFinancialDataForTimeFilter(timeFilter),
        api.getBudgets({ include_progress: 'true' }),
        api.getTransactions({ limit: '10' }),
        api.getAccounts()
      ])

      // Process financial summary
      const summary = financialSummary.status === 'fulfilled' ? financialSummary.value : null

      // Process budgets
      const budgets: BudgetWithProgress[] =
        budgetsResponse.status === 'fulfilled' && budgetsResponse.value.data?.budgets
          ? budgetsResponse.value.data.budgets
          : []


      // Process transactions
      const transactions = transactionsResponse.status === 'fulfilled'
        ? transactionsResponse.value.data?.transactions || []
        : []

      // Process accounts with manual balance support
      let netWorth = 0
      let totalSavings = 0
      const accounts = accountsResponse.status === 'fulfilled'
        ? accountsResponse.value.data?.accounts || []
        : []
    
      for (const account of accounts) {
        const balanceData = await calculateAccountBalance(account.id, this.userId!)
        account.calculatedBalance = balanceData.balance
        account.manualOverrideActive = balanceData.manualOverrideActive
        account.manualBalance = balanceData.manualBalance
        account.transactionImpact = balanceData.transactionImpact
        account.lastManualSet = balanceData.lastManualSet
    
        netWorth += balanceData.balance
    
        if (account.is_savings) {
          totalSavings += balanceData.balance
        }
      }

      return {
        financialSummary: summary,
        timeGranularity: timeFilter,
        budgets,
        recentTransactions: transactions,
        accounts,
        netWorth,
        totalSavings,
        isLoading: false,
        error: null
      }

    } catch (error) {
//      console.error('Error fetching dashboard data:', error)
      return {
        financialSummary: null,
        timeGranularity: timeFilter,
        budgets: [],
        recentTransactions: [],
        accounts: [],
        netWorth: 0,
        totalSavings: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data'
      }
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!this.userId) {
      await this.initializeUser()
    }

    if (!this.userId) {
      return {
        netWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        totalSavings: 0,
        savingsRate: 0
      }
    }

    try {
      const summary = await calculateFinancialSummary(this.userId, 1) // Current month

      // Calculate net worth from accounts
      const accountsResponse = await api.getAccounts()
      let netWorth = 0
      let totalSavings = 0

      if (accountsResponse.data?.accounts) {
        for (const account of accountsResponse.data.accounts) {
          const balanceData = await calculateAccountBalance(account.id, this.userId!)
          netWorth += balanceData.balance

          if (account.is_savings) {
            totalSavings += balanceData.balance
          }
        }
      }

      return {
        netWorth,
        monthlyIncome: summary.totalIncome,
        monthlyExpenses: summary.totalExpenses,
        totalSavings,
        savingsRate: summary.savingsRate
      }

    } catch (error) {
//      console.error('Error fetching dashboard metrics:', error)
      return {
        netWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        totalSavings: 0,
        savingsRate: 0
      }
    }
  }

  async getBudgetAlerts(): Promise<Array<{budgetId: string, message: string, severity: 'warning' | 'error'}>> {
    if (!this.userId) {
      await this.initializeUser()
    }

    if (!this.userId) {
      return []
    }

    try {
      const budgetsResponse = await api.getBudgets({ include_progress: 'true' })
      const alerts: Array<{budgetId: string, message: string, severity: 'warning' | 'error'}> = []

      if (budgetsResponse.data?.budgets) {
        for (const budget of budgetsResponse.data.budgets) {
          if (budget.is_over_budget) {
            alerts.push({
              budgetId: budget.id,
              message: `${budget.name} budget exceeded by $${Math.abs(budget.remaining).toFixed(2)}`,
              severity: 'error'
            })
          } else if (budget.percentage > 80) {
            alerts.push({
              budgetId: budget.id,
              message: `${budget.name} budget is ${budget.percentage}% used`,
              severity: 'warning'
            })
          }
        }
      }

      return alerts

    } catch (error) {
//      console.error('Error fetching budget alerts:', error)
      return []
    }
  }

  // Real-time subscription for data updates
  subscribeToUpdates(callback: (data: DashboardData) => void) {
    if (!this.userId) return () => {}

    const subscriptions = [
      // Subscribe to transactions
      supabase
        .channel('transactions')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${this.userId}`
        }, (payload) => {
          // Invalidate budget progress cache when transactions change
          const transaction = (payload.new || payload.old) as any
          const budgetId = transaction?.budget_id
          if (budgetId) {
            invalidateBudgetProgress(budgetId, this.userId!)
          }
          this.getDashboardData().then(callback)
        })
        .subscribe(),

      // Subscribe to budgets
      supabase
        .channel('budgets')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${this.userId}`
        }, (payload) => {
          // Invalidate budget progress cache when budgets change
          if (payload.eventType === 'DELETE' && payload.old?.id) {
            invalidateBudgetProgress(payload.old.id, this.userId!)
          } else if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && payload.new?.id) {
            invalidateBudgetProgress(payload.new.id, this.userId!)
          }
          this.getDashboardData().then(callback)
        })
        .subscribe(),

      // Subscribe to accounts
      supabase
        .channel('accounts')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'accounts',
          filter: `user_id=eq.${this.userId}`
        }, () => {
          this.getDashboardData().then(callback)
        })
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()