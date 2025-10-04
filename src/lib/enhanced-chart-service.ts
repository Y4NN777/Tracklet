import {
  ChartConfig,
  ChartData,
  ChartServiceResponse,
  DataView,
  GranularityType
} from './types/chart'
import {
  calculateFinancialSummary,
  aggregateDailyData,
  aggregateWeeklyData,
  getCategoryTrends,
  getBudgetProgression,
  getNetWorthHistory,
  getCashFlowData
} from './financial-calculations'

// =========================================
// ENHANCED CHART SERVICE
// =========================================

class EnhancedChartService {
  private userId: string | null = null
  private cache = new Map<string, { data: ChartData; timestamp: Date }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.initializeUser()
  }

  private async initializeUser() {
    try {
      // Note: This would need to be implemented based on your auth system
      // For now, we'll assume userId is passed to methods
    } catch (error) {
      console.error('Failed to initialize user:', error)
    }
  }

  async getChartData(config: ChartConfig, userId?: string): Promise<ChartServiceResponse> {
    if (!userId) {
      return {
        data: { metadata: { timeframe: config.timeframe, granularity: config.granularity, dataView: config.dataView, lastUpdated: new Date() } },
        error: 'User not authenticated',
        timestamp: new Date()
      }
    }

    // Create cache key
    const cacheKey = this.createCacheKey(config, userId)

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && this.isCacheValid(cached.timestamp)) {
      return {
        data: cached.data,
        cached: true,
        timestamp: cached.timestamp
      }
    }

    try {
      let chartData: ChartData

      // Get data based on view type
      switch (config.dataView) {
        case DataView.INCOME_EXPENSE:
          chartData = await this.getIncomeExpenseData(config, userId)
          break
        case DataView.CATEGORY_SPENDING:
          chartData = await this.getCategorySpendingData(config, userId)
          break
        case DataView.NET_WORTH:
          chartData = await this.getNetWorthData(config, userId)
          break
        case DataView.BUDGET_PROGRESS:
          chartData = await this.getBudgetProgressData(config, userId)
          break
        case DataView.CASH_FLOW:
          chartData = await this.getCashFlowData(config, userId)
          break
        default:
          chartData = await this.getIncomeExpenseData(config, userId)
      }

      // Add metadata
      chartData.metadata = {
        timeframe: config.timeframe,
        granularity: config.granularity,
        dataView: config.dataView,
        lastUpdated: new Date()
      }

      // Cache the result
      this.cache.set(cacheKey, { data: chartData, timestamp: new Date() })

      return {
        data: chartData,
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Error fetching chart data:', error)
      return {
        data: { metadata: { timeframe: config.timeframe, granularity: config.granularity, dataView: config.dataView, lastUpdated: new Date() } },
        error: error instanceof Error ? error.message : 'Failed to fetch chart data',
        timestamp: new Date()
      }
    }
  }

  private async getIncomeExpenseData(config: ChartConfig, userId: string): Promise<ChartData> {
    const months = this.getMonthsFromTimeframe(config.timeframe)
    const summary = await calculateFinancialSummary(userId, months, config.granularity)

    return {
      timeSeries: summary.monthlyTrend.map(trend => ({
        date: trend.month + '-01',
        income: trend.income,
        expenses: trend.expenses,
        net: trend.net
      })),
      summary: {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        netIncome: summary.netIncome,
        periodChange: 0, // Would need to calculate vs previous period
        insights: [] // Would be populated by AI insights
      }
    }
  }

  private async getCategorySpendingData(config: ChartConfig, userId: string): Promise<ChartData> {
    const categories = await getCategoryTrends(userId, config)

    return {
      categories,
      summary: {
        totalExpenses: categories.reduce((sum, cat) => sum + cat.value, 0),
        insights: [] // Would be populated by AI insights
      }
    }
  }

  private async getNetWorthData(config: ChartConfig, userId: string): Promise<ChartData> {
    const netWorthHistory = await getNetWorthHistory(userId, config)

    return {
      timeSeries: netWorthHistory,
      summary: {
        insights: [] // Would be populated by AI insights
      }
    }
  }

  private async getBudgetProgressData(config: ChartConfig, userId: string): Promise<ChartData> {
    const budgetData = await getBudgetProgression(userId, config)

    return {
      timeSeries: budgetData,
      summary: {
        insights: [] // Would be populated by AI insights
      }
    }
  }

  private async getCashFlowData(config: ChartConfig, userId: string): Promise<ChartData> {
    const cashFlowData = await getCashFlowData(userId, config)

    return {
      timeSeries: cashFlowData,
      summary: {
        insights: [] // Would be populated by AI insights
      }
    }
  }

  private createCacheKey(config: ChartConfig, userId: string): string {
    return `${userId}-${config.timeframe}-${config.granularity}-${config.dataView}-${JSON.stringify(config.filters)}-${JSON.stringify(config.customRange)}`
  }

  private isCacheValid(timestamp: Date): boolean {
    return Date.now() - timestamp.getTime() < this.CACHE_DURATION
  }

  private getMonthsFromTimeframe(timeframe: string): number {
    switch (timeframe) {
      case '7d': return 1
      case '30d': return 1
      case '3m': return 3
      case '6m': return 6
      case '12m': return 12
      case 'all': return 24 // Roughly 2 years for "all time"
      default: return 6
    }
  }

  // Clear cache for a specific user
  clearUserCache(userId: string) {
    for (const [key] of this.cache) {
      if (key.startsWith(userId)) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear()
  }
}

// Export singleton instance
export const enhancedChartService = new EnhancedChartService()