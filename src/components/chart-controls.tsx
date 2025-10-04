'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { TimeframeType, ChartType, DataView, ChartFilterOptions } from '@/lib/types/chart'
import { useIntlayer } from 'next-intlayer'

interface ChartControlsProps {
  timeframe: TimeframeType
  chartType: ChartType
  dataView: DataView
  customRange?: { startDate: Date; endDate: Date }
  filters?: {
    accounts?: string[]
    categories?: string[]
    transactionTypes?: string[]
  }
  filterOptions?: ChartFilterOptions
  onTimeframeChange: (timeframe: TimeframeType) => void
  onChartTypeChange: (chartType: ChartType) => void
  onDataViewChange: (dataView: DataView) => void
  onCustomRangeChange: (range: { startDate: Date; endDate: Date }) => void
  onFiltersChange: (filters: { accounts?: string[]; categories?: string[]; transactionTypes?: string[] }) => void
}

export function ChartControls({
  timeframe,
  chartType,
  dataView,
  customRange,
  filters = {},
  filterOptions,
  onTimeframeChange,
  onChartTypeChange,
  onDataViewChange,
  onCustomRangeChange,
  onFiltersChange
}: ChartControlsProps) {
  const i = useIntlayer('chart-controls')
  const [startDate, setStartDate] = useState<Date | undefined>(customRange?.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(customRange?.endDate)

  const handleCustomRangeApply = () => {
    if (startDate && endDate) {
      onCustomRangeChange({ startDate, endDate })
      onTimeframeChange(TimeframeType.CUSTOM_RANGE)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
      {/* Data View Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <Select value={dataView} onValueChange={(value) => onDataViewChange(value as DataView)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DataView.INCOME_EXPENSE}>Income vs Expenses</SelectItem>
            <SelectItem value={DataView.CATEGORY_SPENDING}>Category Spending</SelectItem>
            <SelectItem value={DataView.NET_WORTH}>Net Worth</SelectItem>
            <SelectItem value={DataView.BUDGET_PROGRESS}>Budget Progress</SelectItem>
            <SelectItem value={DataView.CASH_FLOW}>Cash Flow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <Select value={timeframe} onValueChange={(value) => onTimeframeChange(value as TimeframeType)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimeframeType.LAST_7_DAYS}>7 Days</SelectItem>
            <SelectItem value={TimeframeType.LAST_30_DAYS}>30 Days</SelectItem>
            <SelectItem value={TimeframeType.LAST_3_MONTHS}>3 Months</SelectItem>
            <SelectItem value={TimeframeType.LAST_6_MONTHS}>6 Months</SelectItem>
            <SelectItem value={TimeframeType.LAST_12_MONTHS}>12 Months</SelectItem>
            <SelectItem value={TimeframeType.ALL_TIME}>All Time</SelectItem>
            <SelectItem value={TimeframeType.CUSTOM_RANGE}>Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Range Picker */}
      {timeframe === TimeframeType.CUSTOM_RANGE && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-32 justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM dd") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-32 justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM dd") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleCustomRangeApply}
            disabled={!startDate || !endDate}
            size="sm"
          >
            Apply
          </Button>
        </div>
      )}

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Chart:</span>
        <div className="flex gap-1">
          <Button
            variant={chartType === ChartType.BAR ? "default" : "outline"}
            size="sm"
            onClick={() => onChartTypeChange(ChartType.BAR)}
          >
            Bar
          </Button>
          <Button
            variant={chartType === ChartType.LINE ? "default" : "outline"}
            size="sm"
            onClick={() => onChartTypeChange(ChartType.LINE)}
          >
            Line
          </Button>
          <Button
            variant={chartType === ChartType.AREA ? "default" : "outline"}
            size="sm"
            onClick={() => onChartTypeChange(ChartType.AREA)}
          >
            Area
          </Button>
          <Button
            variant={chartType === ChartType.PIE ? "default" : "outline"}
            size="sm"
            onClick={() => onChartTypeChange(ChartType.PIE)}
          >
            Pie
          </Button>
          <Button
            variant={chartType === ChartType.COMBO ? "default" : "outline"}
            size="sm"
            onClick={() => onChartTypeChange(ChartType.COMBO)}
          >
            Combo
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      {filterOptions && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filters:</span>

          {/* Account Filter */}
          <Select
            value={filters.accounts?.[0] || "all"}
            onValueChange={(value) => {
              const newAccounts = value === "all" ? undefined : [value]
              onFiltersChange({
                ...filters,
                accounts: newAccounts
              })
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {filterOptions.accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.categories?.[0] || "all"}
            onValueChange={(value) => {
              const newCategories = value === "all" ? undefined : [value]
              onFiltersChange({
                ...filters,
                categories: newCategories
              })
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions.categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}