'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChartConfig,
  TimeframeType,
  ChartType,
  DataView,
  GranularityType,
  ChartConfigUpdate
} from '@/lib/types/chart'

// =========================================
// CHART CONFIGURATION HOOK
// =========================================

const CHART_CONFIG_STORAGE_KEY = 'tracklet-chart-config'

interface UseChartConfigReturn {
  config: ChartConfig
  updateConfig: (updates: ChartConfigUpdate) => void
  resetToDefaults: () => void
  isLoading: boolean
}

// Smart defaults based on user type (would be determined by user data)
function getSmartDefaults(): ChartConfig {
  // For now, use new user defaults - could be enhanced with user analytics
  return {
    timeframe: TimeframeType.LAST_3_MONTHS,
    granularity: GranularityType.MONTHLY,
    chartType: ChartType.BAR,
    dataView: DataView.INCOME_EXPENSE
  }
}

// Active user defaults (more detailed view)
function getActiveUserDefaults(): ChartConfig {
  return {
    timeframe: TimeframeType.LAST_30_DAYS,
    granularity: GranularityType.WEEKLY,
    chartType: ChartType.LINE,
    dataView: DataView.INCOME_EXPENSE
  }
}

// Long-term user defaults (broader view)
function getLongTermUserDefaults(): ChartConfig {
  return {
    timeframe: TimeframeType.LAST_12_MONTHS,
    granularity: GranularityType.MONTHLY,
    chartType: ChartType.AREA,
    dataView: DataView.INCOME_EXPENSE
  }
}

export function useChartConfig(userType: 'new' | 'active' | 'long-term' = 'new'): UseChartConfigReturn {
  const [config, setConfig] = useState<ChartConfig>(getSmartDefaults())
  const [isLoading, setIsLoading] = useState(true)

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHART_CONFIG_STORAGE_KEY)
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        // Validate the stored config has required fields
        if (parsedConfig.timeframe && parsedConfig.chartType && parsedConfig.dataView) {
          // Convert date strings back to Date objects if they exist
          if (parsedConfig.customRange) {
            parsedConfig.customRange.startDate = new Date(parsedConfig.customRange.startDate)
            parsedConfig.customRange.endDate = new Date(parsedConfig.customRange.endDate)
          }
          setConfig(parsedConfig)
        } else {
          // Stored config is invalid, use defaults
          setConfig(getDefaultConfigForUserType(userType))
        }
      } else {
        // No stored config, use defaults
        setConfig(getDefaultConfigForUserType(userType))
      }
    } catch (error) {
      console.error('Error loading chart config from localStorage:', error)
      setConfig(getDefaultConfigForUserType(userType))
    } finally {
      setIsLoading(false)
    }
  }, [userType])

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CHART_CONFIG_STORAGE_KEY, JSON.stringify(config))
      } catch (error) {
        console.error('Error saving chart config to localStorage:', error)
      }
    }
  }, [config, isLoading])

  const updateConfig = useCallback((updates: ChartConfigUpdate) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...updates }

      // Apply smart adjustments based on changes
      const adjustedConfig = applySmartAdjustments(newConfig)

      return adjustedConfig
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    setConfig(getDefaultConfigForUserType(userType))
  }, [userType])

  return {
    config,
    updateConfig,
    resetToDefaults,
    isLoading
  }
}

// Helper function to get appropriate defaults based on user type
function getDefaultConfigForUserType(userType: 'new' | 'active' | 'long-term'): ChartConfig {
  switch (userType) {
    case 'active':
      return getActiveUserDefaults()
    case 'long-term':
      return getLongTermUserDefaults()
    case 'new':
    default:
      return getSmartDefaults()
  }
}

// Apply smart adjustments to config based on user selections
function applySmartAdjustments(config: ChartConfig): ChartConfig {
  const adjustedConfig = { ...config }

  // Adjust granularity based on timeframe for better UX
  if (config.timeframe === TimeframeType.LAST_7_DAYS && config.granularity === GranularityType.MONTHLY) {
    adjustedConfig.granularity = GranularityType.DAILY
  } else if (config.timeframe === TimeframeType.LAST_30_DAYS && config.granularity === GranularityType.MONTHLY) {
    adjustedConfig.granularity = GranularityType.WEEKLY
  } else if (config.timeframe === TimeframeType.LAST_12_MONTHS && config.granularity === GranularityType.DAILY) {
    adjustedConfig.granularity = GranularityType.MONTHLY
  }

  // Suggest chart type based on data view
  if (config.dataView === DataView.CATEGORY_SPENDING && config.chartType === ChartType.LINE) {
    adjustedConfig.chartType = ChartType.PIE
  } else if (config.dataView === DataView.NET_WORTH && config.chartType === ChartType.PIE) {
    adjustedConfig.chartType = ChartType.AREA
  }

  return adjustedConfig
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

export function validateChartConfig(config: ChartConfig): boolean {
  // Basic validation
  const requiredFields = ['timeframe', 'granularity', 'chartType', 'dataView']
  return requiredFields.every(field => config[field as keyof ChartConfig] !== undefined)
}

export function sanitizeChartConfig(config: ChartConfig): ChartConfig {
  const sanitized = { ...config }

  // Ensure valid enum values
  if (!Object.values(TimeframeType).includes(config.timeframe)) {
    sanitized.timeframe = TimeframeType.LAST_6_MONTHS
  }

  if (!Object.values(GranularityType).includes(config.granularity)) {
    sanitized.granularity = GranularityType.MONTHLY
  }

  if (!Object.values(ChartType).includes(config.chartType)) {
    sanitized.chartType = ChartType.BAR
  }

  if (!Object.values(DataView).includes(config.dataView)) {
    sanitized.dataView = DataView.INCOME_EXPENSE
  }

  return sanitized
}