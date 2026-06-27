import { getIntlayer } from 'intlayer';
import { getDashboardData } from './data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  PlusCircle,
  Receipt,
  PiggyBank
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SpendingChart } from '@/components/spending-chart';
import { formatCurrency } from '@/lib/financial-calculations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const i = getIntlayer('dashboard-page', locale as any);
  const data = await getDashboardData();

  const { summary, accounts, recentTransactions, budgets, netWorth, totalSavings, user } = data;

  const hasData = accounts.length > 0 || recentTransactions.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 px-4">
        <div className="bg-primary/10 p-6 rounded-full">
           <Wallet className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-center">{i.welcomeToTracklet}</h2>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          {i.startTracking}
        </p>
        <Link href="/accounts">
          <Button size="lg" className="rounded-full px-8">
            <PlusCircle className="mr-2 h-5 w-5" />
            {i.addAccount}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">{i.netWorth}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(netWorth)}
            </div>
            <p className="text-xs opacity-70 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {i.totalAcrossAccounts}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-none bg-card/50 backdrop-blur">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{i.monthlyIncome}</CardTitle>
            <div className="bg-green-100 p-1.5 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1 text-green-600">
              {formatCurrency(summary.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">{i.thisMonthsEarnings}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-none bg-card/50 backdrop-blur">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{i.monthlyExpenses}</CardTitle>
            <div className="bg-red-100 p-1.5 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1 text-red-600">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">{i.monthlyExpenses}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Spending Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
               <div className="h-[350px]">
                  <SpendingChart userId={user.id} />
               </div>
            </CardContent>
          </Card>

          {/* Budgets Horizontal List */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <Target className="h-5 w-5 text-primary" />
                   {i.budgetStatus}
                </h3>
                <Link href="/budgets" className="text-sm text-primary font-medium hover:underline">View all</Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.length > 0 ? (
                  budgets.slice(0, 4).map((budget) => {
                    if (!budget) return null;
                    return (
                      <Card key={budget.budgetId} className="border-none shadow-sm bg-muted/30">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold">{budget.name}</span>
                            <Badge variant={budget.isOverBudget ? "destructive" : "secondary"} className="text-[10px]">
                               {budget.percentage.toFixed(0)}%
                            </Badge>
                          </div>
                          <Progress value={budget.percentage} className="h-1.5" />
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                             <span>{formatCurrency(budget.spent)} spent</span>
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {budget.daysRemaining}d left</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="col-span-full border-dashed bg-transparent">
                     <CardContent className="flex flex-col items-center justify-center py-8 opacity-50">
                        <Target className="h-8 w-8 mb-2" />
                        <p className="text-sm">{i.noBudgets}</p>
                     </CardContent>
                  </Card>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                {i.recentTransactions}
             </h3>
             <Link href="/transactions" className="text-sm text-primary font-medium hover:underline">See history</Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl bg-card hover:bg-muted/50 transition-colors shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0",
                      txn.type === 'income' ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                    )}>
                       <Receipt className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{txn.description}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{txn.categories?.name || i.uncategorized}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-bold flex-shrink-0",
                    txn.type === 'income' ? "text-green-600" : ""
                  )}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(txn.amount))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                 <p className="text-sm">{i.noTransactions}</p>
              </div>
            )}
          </div>

          {/* Quick Savings Card */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                   <PiggyBank className="h-4 w-4" />
                   {i.totalSavings}
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold mb-4">{formatCurrency(totalSavings)}</div>
                <Link href="/savings">
                   <Button variant="secondary" size="sm" className="w-full rounded-full text-indigo-600 font-bold">
                      Explore AI Savings
                   </Button>
                </Link>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
