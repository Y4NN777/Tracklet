'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  ArrowDownUp,
  PiggyBank,
  Wallet,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SpendingChart } from '@/components/spending-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService, DashboardData, DashboardMetrics } from '@/lib/dashboard-service';
import { formatCurrency } from '@/lib/financial-calculations';
import { useCurrency } from '@/contexts/preferences-context';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<Array<{budgetId: string, message: string, severity: 'warning' | 'error'}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency: formatUserCurrency } = useCurrency();

  useEffect(() => {
    loadDashboardData();

    // Set up real-time updates
    const unsubscribe = dashboardService.subscribeToUpdates((data) => {
      setDashboardData(data);
      setError(data.error);
    });

    return unsubscribe;
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [data, metricsData, alerts] = await Promise.all([
        dashboardService.getDashboardData(),
        dashboardService.getDashboardMetrics(),
        dashboardService.getBudgetAlerts()
      ]);

      setDashboardData(data);
      setMetrics(metricsData);
      setBudgetAlerts(alerts);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there's any data
  const hasData = dashboardData && (
    dashboardData.recentTransactions.length > 0 ||
    dashboardData.budgets.length > 0 ||
    dashboardData.accounts.length > 0 ||
    (dashboardData.financialSummary && (
      dashboardData.financialSummary.totalIncome > 0 ||
      dashboardData.financialSummary.totalExpenses > 0
    ))
  );

  if (!hasData && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Welcome to FinTrack</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Start tracking your finances by adding your first account. Once you have an account set up, you can begin recording transactions.
        </p>
        <Button onClick={() => router.push('/accounts')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error}
        </p>
        <Button onClick={loadDashboardData}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Loading skeletons for summary cards */}
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Loading skeleton for chart */}
          <div className="h-80">
            <Skeleton className="h-full w-full" />
          </div>
          
          {/* Loading skeleton for budget card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Loading skeleton for transactions card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="space-y-2">
          {budgetAlerts.map((alert, index) => (
            <Alert key={alert.budgetId} className={alert.severity === 'error' ? 'border-destructive' : 'border-warning'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatUserCurrency(dashboardData?.netWorth || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-32" />
              ) : (
                'Total across all accounts'
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatUserCurrency(metrics?.monthlyIncome || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-32" />
              ) : (
                'This month\'s earnings'
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatUserCurrency(metrics?.monthlyExpenses || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-32" />
              ) : (
                `${metrics?.savingsRate ? metrics.savingsRate.toFixed(1) : '0'}% savings rate`
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatUserCurrency(dashboardData?.totalSavings || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-32" />
              ) : (
                'Your financial cushion'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart
          monthlyData={dashboardData?.financialSummary?.monthlyTrend}
          isLoading={isLoading}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> Budget Status
            </CardTitle>
            <CardDescription>Your spending against your set budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Loading skeletons for budgets
              [...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : dashboardData?.budgets && dashboardData.budgets.length > 0 ? (
              dashboardData.budgets.slice(0, 4).map((budget) => (
                <div key={budget.budgetId} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{budget.name}</span>
                    <span>
                      {formatUserCurrency(budget.spent)} / {formatUserCurrency(budget.spent + budget.remaining)}
                    </span>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className={budget.isOverBudget ? "[&>div]:bg-destructive" : ""}
                  />
                  {budget.isOverBudget && (
                    <p className="text-xs text-destructive">
                      Over budget by {formatUserCurrency(Math.abs(budget.remaining))}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No budgets set up yet</p>
                <p className="text-sm">Create budgets to track your spending</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A quick look at your latest financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentTransactions.map((txn: any) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {txn.categories?.name || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        txn.type === 'income' ? 'text-success' : 'text-card-foreground'
                      }`}
                    >
                      {txn.type === 'income' ? '+' : '-'}
                      {formatUserCurrency(Math.abs(txn.amount))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <PlusCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

