import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, PiggyBank } from 'lucide-react';

const budgets = [
  { name: 'Groceries', spent: 350, total: 500, remaining: 150 },
  { name: 'Dining Out', spent: 180, total: 200, remaining: 20 },
  { name: 'Transport', spent: 120, total: 150, remaining: 30 },
  { name: 'Shopping', spent: 250, total: 200, remaining: -50 },
  { name: 'Utilities', spent: 150, total: 150, remaining: 0 },
  { name: 'Entertainment', spent: 80, total: 150, remaining: 70 },
];

const goals = [
  { name: 'Emergency Fund', saved: 5000, total: 10000 },
  { name: 'Vacation to Hawaii', saved: 1200, total: 4000 },
  { name: 'New Car Down Payment', saved: 8000, total: 15000 },
]

export default function BudgetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            Monthly Budgets
          </h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Budget
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = (budget.spent / budget.total) * 100;
            return (
              <Card key={budget.name}>
                <CardHeader>
                  <CardTitle>{budget.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={Math.min(progress, 100)} className={progress > 100 ? '[&>div]:bg-destructive' : ''} />
                </CardContent>
                <CardFooter className="flex justify-between text-sm">
                  <p>
                    <span className="font-bold">${budget.spent.toFixed(2)}</span> spent
                  </p>
                  <p className="text-muted-foreground">
                    {budget.remaining >= 0 ? `$${budget.remaining.toFixed(2)} left` : `$${Math.abs(budget.remaining).toFixed(2)} over`}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
       <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PiggyBank className="h-6 w-6" />
            Financial Goals
          </h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Goal
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = (goal.saved / goal.total) * 100;
            return (
              <Card key={goal.name}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>
                    Target: {goal.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <Progress value={progress} className="h-3" />
                   <p className="text-sm mt-2 text-muted-foreground">{progress.toFixed(1)}% complete</p>
                </CardContent>
                 <CardFooter className="flex justify-end text-sm">
                  <p>
                    <span className="font-bold">${goal.saved.toLocaleString()}</span> saved
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
