'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp, Loader2, Clock } from 'lucide-react';
import { useIntlayer } from 'next-intlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { enhancedChartService } from '@/lib/enhanced-chart-service';
import { ChartData, TimeframeType, ChartType, DataView, GranularityType } from '@/lib/types/chart';

interface SpendingChartProps {
  userId?: string
  initialTimeFilter?: 'daily' | 'weekly' | 'monthly'
  className?: string
}


export function SpendingChart({ userId, initialTimeFilter = 'monthly', className }: SpendingChartProps) {
  const i = useIntlayer('spending-chart');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>(initialTimeFilter);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load chart data when component mounts or timeFilter/userId changes
  useEffect(() => {
    if (userId) {
      loadChartData(timeFilter);
    } else {
      setError('User not authenticated');
      setIsLoading(false);
    }
  }, [userId, timeFilter]);

  const loadChartData = async (filter: 'daily' | 'weekly' | 'monthly') => {
    try {
      setIsLoading(true);
      setError(null);

      // Map filter to granularity
      const granularity = filter === 'daily' ? GranularityType.DAILY :
                         filter === 'weekly' ? GranularityType.WEEKLY :
                         GranularityType.MONTHLY;

      const config = {
        timeframe: TimeframeType.ALL_TIME, // Let service handle date ranges
        granularity,
        chartType: ChartType.BAR,
        dataView: DataView.INCOME_EXPENSE
      };

      const response = await enhancedChartService.getChartData(config, userId!);

      if (response.error) {
        setError(response.error);
        setChartData(null);
      } else {
        setChartData(response.data);
      }
    } catch (err) {
      setError('Failed to load chart data');
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeFilterChange = (value: 'daily' | 'weekly' | 'monthly') => {
    setTimeFilter(value);
  };

  const chartConfig = {
    income: {
      label: i.income,
      color: 'hsl(var(--chart-1))',
    },
    expenses: {
      label: i.expenses,
      color: 'hsl(var(--chart-2))',
    },
  };

  // Transform data for chart display
  const processedChartData = transformChartData(chartData, timeFilter, i);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
              </CardTitle>
              <CardDescription>{i.incomeVsExpenses}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
              </CardTitle>
              <CardDescription>{i.incomeVsExpenses}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!processedChartData.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
              </CardTitle>
              <CardDescription>{i.incomeVsExpenses}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
            {i.noData}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
            </CardTitle>
            <CardDescription>{i.incomeVsExpenses}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={processedChartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function transformChartData(data: any, timeFilter: 'daily' | 'weekly' | 'monthly', i: any): any[] {
  if (!data || !data.timeSeries) return [];

  const timeSeries = data.timeSeries;

  if (timeFilter === 'monthly') {
    return timeSeries.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString(i.locale, { month: 'long' }),
      income: Math.round(item.income),
      expenses: Math.round(item.expenses)
    })).reverse();
  }

  if (timeFilter === 'daily') {
    return timeSeries.map((item: any) => ({
      date: formatDateLabel(item.date),
      income: Math.round(item.income || 0),
      expenses: Math.round(item.expenses || 0)
    }));
  }

  if (timeFilter === 'weekly') {
    return timeSeries.map((item: any) => ({
      date: item.date ? `Week ${item.date.split('-W')[1]}` : item.date,
      income: Math.round(item.income || 0),
      expenses: Math.round(item.expenses || 0)
    }));
  }

  // Fallback for unknown data types
  return [];
}

function formatDateLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
