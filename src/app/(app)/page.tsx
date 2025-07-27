'use client';

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
