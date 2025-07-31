'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
import { SpendingChart } from '@/components/spending-chart';
import { Skeleton } from '@/components/ui/skeleton';

const transactions = [
  {
    id: 'txn1',
    description: 'Spotify Subscription',
    amount: -10.99,
    category: 'Entertainment',
    date: '2024-07-25',
  },
  {
    id: 'txn2',
    description: 'Paycheck',
    amount: 2500,
    category: 'Income',
    date: '2024-07-25',
  },
  {
    id: 'txn3',
    description: 'Groceries at Walmart',
    amount: -75.43,
    category: 'Food',
    date: '2024-07-24',
  },
  {
    id: 'txn4',
    description: 'Gasoline',
    amount: -45.0,
    category: 'Transport',
    date: '2024-07-23',
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if there's any data
  const hasTransactions = transactions.length > 0;
  // In a real app, you would check all data sources (net worth, income, expenses, savings, budgets)
  const hasData = hasTransactions; // Simplified for this example

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Welcome to FinTrack AI</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Start tracking your finances by adding your first transaction.
        </p>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,750.00</div>
            <p className="text-xs text-muted-foreground">This month's earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,241.50</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,874.00</div>
            <p className="text-xs text-muted-foreground">Your financial cushion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> Budget Status
            </CardTitle>
            <CardDescription>Your spending against your set budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Groceries</span>
                <span>$350 / $500</span>
              </div>
              <Progress value={70} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Entertainment</span>
                <span>$180 / $200</span>
              </div>
              <Progress value={90} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Transport</span>
                <span>$120 / $150</span>
              </div>
              <Progress value={80} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Shopping</span>
                <span>$250 / $200</span>
              </div>
              <Progress value={100} className="[&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A quick look at your latest financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.category}</Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      txn.amount > 0 ? 'text-success' : 'text-card-foreground'
                    }`}
                  >
                    {txn.amount > 0 ? '+' : ''}$
                    {Math.abs(txn.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
