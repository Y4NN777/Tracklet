'use client';

import { useState } from 'react';
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
import { BudgetForm } from '@/components/budget-form';
import { GoalForm } from '@/components/goal-form';

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
  const [openBudget, setOpenBudget] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);

  const handleAddBudget = (values: any) => {
    // TODO: Implement actual budget adding logic
    console.log('Budget values:', values);
  };

  const handleAddGoal = (values: any) => {
    // TODO: Implement actual goal adding logic
    console.log('Goal values:', values);
  };

  // Check if there are any budgets or goals
  const hasBudgets = budgets.length > 0;
  const hasGoals = goals.length > 0;
  const hasData = hasBudgets || hasGoals;

  if (!hasData) {
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-6 w-6" />
              Monthly Budgets
            </h2>
            <Button onClick={() => setOpenBudget(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Budget
            </Button>
          </div>
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <Target className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No budgets yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Start managing your finances by creating your first budget.
                </p>
                <Button onClick={() => setOpenBudget(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <PiggyBank className="h-6 w-6" />
              Financial Goals
            </h2>
            <Button onClick={() => setOpenGoal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </div>
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <PiggyBank className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No financial goals yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Set your financial goals to stay motivated and track your progress.
                </p>
                <Button onClick={() => setOpenGoal(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            Monthly Budgets
          </h2>
          <Button onClick={() => setOpenBudget(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> New Budget
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PiggyBank className="h-6 w-6" />
            Financial Goals
          </h2>
          <Button onClick={() => setOpenGoal(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> New Goal
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <BudgetForm open={openBudget} setOpen={setOpenBudget} onSubmit={handleAddBudget} />
      <GoalForm open={openGoal} setOpen={setOpenGoal} onSubmit={handleAddGoal} />
    </>
  );
}
