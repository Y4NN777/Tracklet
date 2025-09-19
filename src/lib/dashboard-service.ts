import { supabase } from './supabase'
import {
  calculateFinancialSummary,
  calculateBudgetProgress,
  calculateAccountBalance,
  FinancialSummary,
  BudgetProgress
} from './financial-calculations'
import { api } from './api-client'

export interface DashboardData {
  financialSummary: FinancialSummary | null
  budgets: BudgetProgress[]
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

  async getDashboardData(): Promise<DashboardData> {
    if (!this.userId) {
      await this.initializeUser()
    }

    if (!this.userId) {
      return {
        financialSummary: null,
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
        calculateFinancialSummary(this.userId, 6),
        api.getBudgets({ include_progress: 'true' }),
        api.getTransactions({ limit: '10' }),
        api.getAccounts()
      ])

      // Process financial summary
      const summary = financialSummary.status === 'fulfilled' ? financialSummary.value : null

      // Process budgets
      const budgets: BudgetProgress[] = []
      if (budgetsResponse.status === 'fulfilled' && budgetsResponse.value.data?.budgets) {
        for (const budget of budgetsResponse.value.data.budgets) {
          const progress = await calculateBudgetProgress(budget.id, this.userId!)
          if (progress) {
            budgets.push(progress)
          }
        }
      }

      // Process transactions
      const transactions = transactionsResponse.status === 'fulfilled'
        ? transactionsResponse.value.data?.transactions || []
        : []

      // Process accounts and calculate net worth
      let netWorth = 0
      let totalSavings = 0
      const accounts = accountsResponse.status === 'fulfilled'
        ? accountsResponse.value.data?.accounts || []
        : []

      for (const account of accounts) {
        const balance = await calculateAccountBalance(account.id, this.userId!)
        account.calculatedBalance = balance
        netWorth += balance

        // Assume savings accounts are those with 'savings' in name or type
        if (account.name?.toLowerCase().includes('savings') ||
            account.type?.toLowerCase().includes('savings')) {
          totalSavings += balance
        }
      }

      return {
        financialSummary: summary,
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
          const balance = await calculateAccountBalance(account.id, this.userId!)
          netWorth += balance

          if (account.name?.toLowerCase().includes('savings') ||
              account.type?.toLowerCase().includes('savings')) {
            totalSavings += balance
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
          const progress = await calculateBudgetProgress(budget.id, this.userId!)
          if (progress) {
            if (progress.isOverBudget) {
              alerts.push({
                budgetId: budget.id,
                message: `${budget.name} budget exceeded by $${Math.abs(progress.remaining).toFixed(2)}`,
                severity: 'error'
              })
            } else if (progress.percentage > 80) {
              alerts.push({
                budgetId: budget.id,
                message: `${budget.name} budget is ${progress.percentage}% used`,
                severity: 'warning'
              })
            }
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
        }, () => {
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
        }, () => {
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