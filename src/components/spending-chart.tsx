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
import { TrendingUp, Loader2 } from 'lucide-react';
import { MonthlyData } from '@/lib/financial-calculations';
import { useIntlayer } from 'next-intlayer';

interface SpendingChartProps {
  monthlyData?: MonthlyData[]
  isLoading?: boolean
}

export function SpendingChart({ monthlyData, isLoading = false }: SpendingChartProps) {
  const i = useIntlayer('spending-chart');

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

  // Transform monthly data for the chart - reverse order to start from current month
  const chartData = monthlyData?.map(data => ({
    month: new Date(data.month + '-01').toLocaleDateString(i.locale, { month: 'long' }),
    income: Math.round(data.income),
    expenses: Math.round(data.expenses)
  })).reverse() || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
          </CardTitle>
          <CardDescription>{i.incomeVsExpenses}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
          </CardTitle>
          <CardDescription>{i.incomeVsExpenses}</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> {i.spendingTrends}
        </CardTitle>
        <CardDescription>{i.incomeVsExpenses}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
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
