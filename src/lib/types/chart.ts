// =========================================
// CHART CONFIGURATION TYPES & INTERFACES
// =========================================

export enum TimeframeType {
  LAST_7_DAYS = '7d',
  LAST_30_DAYS = '30d',
  LAST_3_MONTHS = '3m',
  LAST_6_MONTHS = '6m',
  LAST_12_MONTHS = '12m',
  CUSTOM_RANGE = 'custom',
  ALL_TIME = 'all'
}

export enum ChartType {
  LINE = 'line',           // Trend analysis
  BAR = 'bar',            // Period comparison
  AREA = 'area',          // Volume visualization
  PIE = 'pie',            // Category breakdown
  COMBO = 'combo'         // Mixed insights
}

export enum DataView {
  INCOME_EXPENSE = 'income_expense',     // Current view
  NET_WORTH = 'net_worth',              // Account balances over time
  CATEGORY_SPENDING = 'category_spending', // Category breakdowns
  BUDGET_PROGRESS = 'budget_progress',   // Budget vs actual
  CASH_FLOW = 'cash_flow'               // Money movement
}

export enum GranularityType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface ChartConfig {
  timeframe: TimeframeType
  granularity: GranularityType
  chartType: ChartType
  dataView: DataView
  customRange?: {
    startDate: Date
    endDate: Date
  }
  filters?: {
    accounts?: string[]
    categories?: string[]
    transactionTypes?: string[]
  }
  compareWith?: 'previous_period' | 'budget' | 'goal'
}

// =========================================
// CHART DATA INTERFACES
// =========================================

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
  category?: string
  color?: string
}

export interface TimeSeriesDataPoint {
  date: string
  income?: number
  expenses?: number
  net?: number
  balance?: number
  budget?: number
  actual?: number
  [key: string]: any
}

export interface CategoryDataPoint {
  name: string
  value: number
  percentage: number
  color: string
  icon?: string
}

export interface ChartData {
  timeSeries?: TimeSeriesDataPoint[]
  categories?: CategoryDataPoint[]
  summary?: {
    totalIncome?: number
    totalExpenses?: number
    netIncome?: number
    periodChange?: number
    insights?: string[]
  }
  metadata?: {
    timeframe: TimeframeType
    granularity: GranularityType
    dataView: DataView
    lastUpdated: Date
  }
}

// =========================================
// COMPONENT PROPS INTERFACES
// =========================================

export interface EnhancedSpendingChartProps {
  config: ChartConfig
  onConfigChange: (config: ChartConfig) => void
  data: ChartData
  isLoading: boolean
  onExport?: (format: 'png' | 'svg' | 'csv' | 'pdf') => void
  className?: string
}

// =========================================
// SERVICE INTERFACES
// =========================================

export interface ChartServiceResponse {
  data: ChartData
  error?: string
  cached?: boolean
  timestamp: Date
}

export interface ChartExportOptions {
  format: 'png' | 'svg' | 'csv' | 'pdf'
  filename?: string
  includeData?: boolean
  includeMetadata?: boolean
}

// =========================================
// UTILITY TYPES
// =========================================

export type ChartConfigUpdate = Partial<ChartConfig>

export interface ChartFilterOptions {
  accounts: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string; color: string; icon: string }>
  transactionTypes: Array<{ value: string; label: string }>
}