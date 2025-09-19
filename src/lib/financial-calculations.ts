import { supabase } from './supabase'

// =========================================
// FINANCIAL CALCULATIONS & BUSINESS LOGIC
// =========================================

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  savingsRate: number
  topCategories: CategorySpending[]
  monthlyTrend: MonthlyData[]
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color: string
  icon: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export interface BudgetProgress {
  budgetId: string
  name: string
  spent: number
  remaining: number
  percentage: number
  isOverBudget: boolean
  categoryName: string
}

// =========================================
// MAIN FINANCIAL SUMMARY CALCULATION
// =========================================

export async function calculateFinancialSummary(
  userId: string,
  months: number = 6
): Promise<FinancialSummary> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  // Get transactions for the period
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      amount,
      type,
      date,
      categories (
        id,
        name,
        color,
        icon
      )
    `)
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])

  if (error) {
//    console.error('Error fetching transactions for summary:', error)
    throw new Error('Failed to calculate financial summary')
  }

  // Calculate totals
  const totalIncome = transactions
    ?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const totalExpenses = transactions
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0

  // Calculate category spending
  const categorySpending = calculateCategorySpending(transactions || [])

  // Calculate monthly trends
  const monthlyTrend = calculateMonthlyTrends(transactions || [], months)

  return {
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate: Math.round(savingsRate * 100) / 100,
    topCategories: categorySpending.slice(0, 5), // Top 5 categories
    monthlyTrend
  }
}

// =========================================
// CATEGORY SPENDING ANALYSIS
// =========================================

function calculateCategorySpending(transactions: any[]): CategorySpending[] {
  const categoryTotals: { [key: string]: any } = {}

  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const categoryId = transaction.categories?.id
      const categoryName = transaction.categories?.name || 'Uncategorized'
      const color = transaction.categories?.color || '#6366f1'
      const icon = transaction.categories?.icon || '📊'

      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = {
          categoryId,
          categoryName,
          amount: 0,
          color,
          icon
        }
      }

      categoryTotals[categoryId].amount += transaction.amount
    })

  const totalExpenses = Object.values(categoryTotals)
    .reduce((sum: number, cat: any) => sum + cat.amount, 0)

  return Object.values(categoryTotals)
    .map((cat: any) => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
}

// =========================================
// MONTHLY TRENDS ANALYSIS
// =========================================

function calculateMonthlyTrends(transactions: any[], months: number): MonthlyData[] {
  const monthlyData: { [key: string]: MonthlyData } = {}

  // Initialize months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format

    monthlyData[monthKey] = {
      month: monthKey,
      income: 0,
      expenses: 0,
      net: 0
    }
  }

  // Aggregate transactions by month
  transactions.forEach(transaction => {
    const monthKey = transaction.date.slice(0, 7)
    if (monthlyData[monthKey]) {
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount
      } else if (transaction.type === 'expense') {
        monthlyData[monthKey].expenses += transaction.amount
      }
    }
  })

  // Calculate net income for each month
  return Object.values(monthlyData)
    .map(month => ({
      ...month,
      net: month.income - month.expenses
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

// =========================================
// BUDGET PROGRESS CALCULATION
// =========================================

export async function calculateBudgetProgress(
  budgetId: string,
  userId: string
): Promise<BudgetProgress | null> {
  // Get budget details
  const { data: budget, error: budgetError } = await supabase
    .from('budgets')
    .select(`
      id,
      name,
      amount,
      start_date,
      end_date,
      category_id,
      categories (
        id,
        name
      )
    `)
    .eq('id', budgetId)
    .eq('user_id', userId)
    .single()

  if (budgetError || !budget) {
//    console.error('Error fetching budget:', budgetError)
    return null
  }

  // Get transactions for this budget's category and period
  const { data: transactions, error: transactionError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .eq('category_id', budget.category_id)
    .gte('date', budget.start_date)
    .lte('date', budget.end_date || new Date().toISOString().split('T')[0])

  if (transactionError) {
//    console.error('Error fetching transactions for budget:', transactionError)
    return null
  }

  const spent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0
  const remaining = budget.amount - spent
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

  return {
    budgetId: budget.id,
    name: budget.name,
    spent,
    remaining,
    percentage: Math.round(percentage * 100) / 100,
    isOverBudget: spent > budget.amount,
    categoryName: (budget.categories as any)?.name || 'Uncategorized'
  }
}

// =========================================
// ACCOUNT BALANCE CALCULATION
// =========================================

export async function calculateAccountBalance(accountId: string, userId: string): Promise<number> {
  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', userId)
    .single()

  if (accountError || !account) {
//    console.error('Error fetching account:', accountError)
    return 0
  }

  // Get all transactions for this account
  const { data: transactions, error: transactionError } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .eq('account_id', accountId)

  if (transactionError) {
//    console.error('Error fetching transactions for account:', transactionError)
    return account.balance || 0
  }

  // Calculate balance from transactions
  const transactionBalance = transactions?.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount
    } else if (transaction.type === 'expense') {
      return balance - transaction.amount
    }
    return balance
  }, 0) || 0

  return (account.balance || 0) + transactionBalance
}

// =========================================
// FINANCIAL INSIGHTS & RECOMMENDATIONS
// =========================================

export async function generateFinancialInsights(userId: string): Promise<string[]> {
  const insights: string[] = []

  try {
    const summary = await calculateFinancialSummary(userId, 3) // Last 3 months

    // Savings rate insights
    if (summary.savingsRate < 20) {
      insights.push(`💡 Your savings rate is ${summary.savingsRate}%. Consider aiming for 20% to build financial security.`)
    } else if (summary.savingsRate > 50) {
      insights.push(`🎉 Excellent! Your savings rate of ${summary.savingsRate}% shows great financial discipline.`)
    }

    // Spending insights
    if (summary.topCategories.length > 0) {
      const topCategory = summary.topCategories[0]
      if (topCategory.percentage > 40) {
        insights.push(`📊 ${topCategory.categoryName} accounts for ${topCategory.percentage.toFixed(1)}% of your expenses. Consider reviewing this category.`)
      }
    }

    // Trend insights
    if (summary.monthlyTrend.length >= 2) {
      const currentMonth = summary.monthlyTrend[summary.monthlyTrend.length - 1]
      const previousMonth = summary.monthlyTrend[summary.monthlyTrend.length - 2]

      if (currentMonth.expenses > previousMonth.expenses * 1.2) {
        insights.push(`📈 Your expenses increased by ${((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100).toFixed(1)}% this month.`)
      }
    }

  } catch (error) {
//    console.error('Error generating insights:', error)
  }

  return insights
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}