'use client';

import { useRef } from 'react';
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
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Loader2, Download } from 'lucide-react';
import { useIntlayer } from 'next-intlayer';
import {
  EnhancedSpendingChartProps,
  ChartType,
  DataView,
  ChartData,
  CategoryDataPoint,
  TimeSeriesDataPoint
} from '@/lib/types/chart';
import { ChartExporter } from '@/lib/chart-export';

export function EnhancedSpendingChart({
  config,
  data,
  isLoading = false,
  onExport,
  className
}: EnhancedSpendingChartProps) {
  const i = useIntlayer('spending-chart');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: 'png' | 'svg' | 'csv' | 'pdf') => {
    if (onExport) {
      onExport(format);
      return;
    }

    // Default export implementation
    try {
      await ChartExporter.export(format, chartRef.current, data);
    } catch (error) {
      console.error('Export failed:', error);
      // Could show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> {getChartTitle(config.dataView, i)}
          </CardTitle>
          <CardDescription>{getChartDescription(config.dataView, i)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || (!data.timeSeries?.length && !data.categories?.length)) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> {getChartTitle(config.dataView, i)}
          </CardTitle>
          <CardDescription>{getChartDescription(config.dataView, i)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
            {i.noData}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> {getChartTitle(config.dataView, i)}
            </CardTitle>
            <CardDescription>{getChartDescription(config.dataView, i)}</CardDescription>
          </div>
          {onExport && (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <select
                className="text-sm border rounded px-2 py-1"
                onChange={(e) => handleExport(e.target.value as 'png' | 'svg' | 'csv' | 'pdf')}
                defaultValue=""
              >
                <option value="" disabled>Export</option>
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent ref={chartRef}>
        <ChartRenderer config={config} data={data} />
      </CardContent>
    </Card>
  );
}

// Chart Renderer Component
function ChartRenderer({ config, data }: { config: any; data: ChartData }) {
  const i = useIntlayer('spending-chart');

  // Base chart config
  const chartConfig = {
    income: { label: i.income, color: 'hsl(var(--chart-1))' },
    expenses: { label: i.expenses, color: 'hsl(var(--chart-2))' },
    net: { label: i.netIncome || 'Net', color: 'hsl(var(--chart-3))' },
    balance: { label: 'Balance', color: 'hsl(var(--chart-4))' },
  };

  switch (config.chartType) {
    case ChartType.BAR:
      return renderBarChart(data.timeSeries || [], chartConfig);
    case ChartType.LINE:
      return renderLineChart(data.timeSeries || [], chartConfig);
    case ChartType.AREA:
      return renderAreaChart(data.timeSeries || [], chartConfig);
    case ChartType.PIE:
      return renderPieChart(data.categories || [], chartConfig);
    case ChartType.COMBO:
      return renderComboChart(data.timeSeries || [], chartConfig);
    default:
      return renderBarChart(data.timeSeries || [], chartConfig);
  }
}

// Individual chart renderers
function renderBarChart(data: TimeSeriesDataPoint[], config: any) {
  const processedData = data.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={processedData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function renderLineChart(data: TimeSeriesDataPoint[], config: any) {
  const processedData = data.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <LineChart data={processedData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} />
        <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}

function renderAreaChart(data: TimeSeriesDataPoint[], config: any) {
  const processedData = data.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={processedData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="income" stackId="1" stroke="var(--color-income)" fill="var(--color-income)" />
        <Area type="monotone" dataKey="expenses" stackId="1" stroke="var(--color-expenses)" fill="var(--color-expenses)" />
      </AreaChart>
    </ChartContainer>
  );
}

function renderPieChart(data: CategoryDataPoint[], config: any) {
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <PieChart accessibilityLayer>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}

function renderComboChart(data: TimeSeriesDataPoint[], config: any) {
  const processedData = data.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={processedData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        <Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth={2} />
      </BarChart>
    </ChartContainer>
  );
}

// Helper functions
function getChartTitle(dataView: DataView, i: any): string {
  switch (dataView) {
    case DataView.CATEGORY_SPENDING:
      return i.categorySpending || 'Category Spending';
    case DataView.NET_WORTH:
      return i.netWorth || 'Net Worth';
    case DataView.BUDGET_PROGRESS:
      return i.budgetProgress || 'Budget Progress';
    case DataView.CASH_FLOW:
      return i.cashFlow || 'Cash Flow';
    case DataView.INCOME_EXPENSE:
    default:
      return i.spendingTrends;
  }
}

function getChartDescription(dataView: DataView, i: any): string {
  switch (dataView) {
    case DataView.CATEGORY_SPENDING:
      return i.spendingByCategory || 'Breakdown of expenses by category';
    case DataView.NET_WORTH:
      return i.netWorthOverTime || 'Account balances over time';
    case DataView.BUDGET_PROGRESS:
      return i.budgetVsActual || 'Budget performance tracking';
    case DataView.CASH_FLOW:
      return i.moneyMovement || 'Income and expense flows';
    case DataView.INCOME_EXPENSE:
    default:
      return i.incomeVsExpenses;
  }
}

function formatDateLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}

// Legacy component for backward compatibility
interface SpendingChartProps {
  monthlyData?: any[]
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
  const chartData = monthlyData?.map((data: any) => ({
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
