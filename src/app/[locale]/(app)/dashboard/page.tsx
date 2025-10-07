'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
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
import { useCurrency } from '@/contexts/preferences-context';
import { useIntlayer } from 'next-intlayer';

export default function DashboardPage() {
  const i = useIntlayer('dashboard-page');
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<Array<{ budgetId: string, message: string, severity: 'warning' | 'error' }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { formatCurrency: formatUserCurrency } = useCurrency();


  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
      } catch (error) {
        console.error('Error getting user ID:', error);
        setUserId(null);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }

    // Set up real-time updates
    const unsubscribe = dashboardService.subscribeToUpdates((data) => {
      setDashboardData(data);
      setError(data.error);
    });

    return unsubscribe;
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [data, metricsData, alerts] = await Promise.all([
        dashboardService.getDashboardData(), // Default to monthly
        dashboardService.getDashboardMetrics(),
        dashboardService.getBudgetAlerts()
      ]);

      setDashboardData(data);
      setMetrics(metricsData);
      setBudgetAlerts(alerts);
    } catch (err) {
      //      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : i.failedToLoad);
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
      (dashboardData.timeGranularity === 'monthly' &&
       typeof dashboardData.financialSummary === 'object' &&
       !Array.isArray(dashboardData.financialSummary) &&
       'totalIncome' in dashboardData.financialSummary &&
       'totalExpenses' in dashboardData.financialSummary &&
       (dashboardData.financialSummary.totalIncome > 0 ||
        dashboardData.financialSummary.totalExpenses > 0)) ||
      (Array.isArray(dashboardData.financialSummary) && dashboardData.financialSummary.length > 0)
    ))
  );

  if (!hasData && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">{i.welcomeToTracklet}</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {i.startTracking}
        </p>
        <Button onClick={() => router.push('/accounts')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {i.addAccount}
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">{i.errorLoadingDashboard}</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error}
        </p>
        <Button onClick={() => loadDashboardData()}>
          {i.tryAgain}
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
            <Alert key={alert.budgetId} variant={alert.severity === 'error' ? 'destructive' : alert.severity === 'warning' ? 'warning' : 'info'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i.netWorth}</CardTitle>
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
                i.totalAcrossAccounts
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i.monthlyIncome}</CardTitle>
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
                i.thisMonthsEarnings
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i.monthlyExpenses}</CardTitle>
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
                i.monthlyExpenses
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i.totalSavings}</CardTitle>
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
                i.yourFinancialCushion
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart
          userId={userId || undefined}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> {i.budgetStatus}
            </CardTitle>
            <CardDescription>{i.spendingAgainstBudgets}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              // Loading skeletons for budgets - Fixed with unique keys
              [...Array(4)].map((_, index) => (
                <div key={`budget-skeleton-${index}`} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : dashboardData?.budgets && dashboardData.budgets.length > 0 ? (
              dashboardData.budgets.slice(0, 4).map((budget, index) => (
                // Using both id and index as fallback for unique keys
                <div key={budget.id || `budget-${index}`} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{budget.name}</span>
                    <div className="text-right">
                      <div>{formatUserCurrency(budget.spent)} / {formatUserCurrency(budget.amount)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {budget.days_remaining} {i.days} • {formatUserCurrency(budget.spending_velocity || 0)}/{i.perDay}
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={budget.percentage}
                    className={budget.is_over_budget ? "[&>div]:bg-destructive" : ""}
                  />

                  {/* Enhanced insights with proper Lucide icons and tooltips */}
                  <div className="flex justify-between text-xs">
                    {budget.period_comparison && (
                      <span
                        className={`flex items-center gap-1 ${budget.period_comparison > 0 ? "text-red-500" : "text-green-500"}`}
                        title={`${budget.period_comparison > 0 ? i.spendingIncreased : i.spendingDecreased} ${budget.period} ${i.period}`}
                      >
                        {budget.period_comparison > 0 ?
                          <TrendingUp className="h-3 w-3" /> :
                          <TrendingDown className="h-3 w-3" />
                        }
                        {Math.abs(budget.period_comparison)}% {i.vsLastPeriod}
                      </span>
                    )}
                    {budget.projected_overspend_date && (
                      <span
                        className="text-orange-500 flex items-center gap-1"
                        title={i.overspendRiskTooltip}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {new Date(budget.projected_overspend_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{i.noBudgets}</p>
                <p className="text-sm">{i.createBudgets}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{i.recentTransactions}</CardTitle>
          <CardDescription>{i.latestFinancialActivities}</CardDescription>
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
                  <TableHead>{i.description}</TableHead>
                  <TableHead>{i.category}</TableHead>
                  <TableHead className="text-right">{i.amount}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentTransactions.map((txn: any) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {txn.categories?.name || i.uncategorized}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${txn.type === 'income' ? 'text-success' : 'text-card-foreground'
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
              <p>{i.noTransactions}</p>
              <p className="text-sm">{i.addFirstTransaction}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}