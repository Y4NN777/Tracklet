import {
  ChartConfig,
  ChartData,
  ChartServiceResponse,
  DataView,
  GranularityType
} from './types/chart'
import { supabase } from './supabase'
import {
  calculateFinancialSummary,
  calculateDailyFinancialSummary,
  calculateWeeklyFinancialSummary
} from './financial-calculations'

// =========================================
// ENHANCED CHART SERVICE
// =========================================

class EnhancedChartService {
  private cache = new Map<string, { data: ChartData; timestamp: Date }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async getChartData(config: ChartConfig, userId: string): Promise<ChartServiceResponse> {
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

      // Get data based on granularity (for now, only income/expense view)
      switch (config.granularity) {
        case GranularityType.DAILY:
          chartData = await this.getDailyData(userId)
          break
        case GranularityType.WEEKLY:
          chartData = await this.getWeeklyData(userId)
          break
        case GranularityType.MONTHLY:
        default:
          chartData = await this.getMonthlyData(userId)
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

  private async getMonthlyData(userId: string): Promise<ChartData> {
    const summary = await calculateFinancialSummary(userId, 6) // Last 6 months

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
        insights: []
      }
    }
  }

  private async getDailyData(userId: string): Promise<ChartData> {
    const dailyData = await calculateDailyFinancialSummary(userId, 30) // Last 30 days

    return {
      timeSeries: dailyData.map(item => ({
        date: item.date,
        income: item.income,
        expenses: item.expenses,
        net: item.net
      })),
      summary: {
        insights: []
      }
    }
  }

  private async getWeeklyData(userId: string): Promise<ChartData> {
    const weeklyData = await calculateWeeklyFinancialSummary(userId, 12) // Last 12 weeks

    return {
      timeSeries: weeklyData.map(item => ({
        date: item.week,
        income: item.income,
        expenses: item.expenses,
        net: item.net
      })),
      summary: {
        insights: []
      }
    }
  }

  private createCacheKey(config: ChartConfig, userId: string): string {
    return `${userId}-${config.granularity}-${config.dataView}`
  }

  private isCacheValid(timestamp: Date): boolean {
    return Date.now() - timestamp.getTime() < this.CACHE_DURATION
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