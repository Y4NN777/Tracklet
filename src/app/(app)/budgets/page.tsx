'use client';

import { useState, useEffect } from 'react';
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
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { api } from '@/lib/api-client';

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
  categories?: {
    name: string;
  };
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  description?: string;
}

export default function BudgetsPage() {
  const [openBudget, setOpenBudget] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch budgets and goals on component mount
  useEffect(() => {
    fetchBudgetsAndGoals();
  }, []);

  const fetchBudgetsAndGoals = async () => {
    setLoading(true);
    try {
      const [budgetsResponse, goalsResponse] = await Promise.all([
        api.getBudgets({ include_progress: true }),
        api.getGoals({ include_progress: true })
      ]);

      if (budgetsResponse.data) {
        setBudgets(budgetsResponse.data.budgets || []);
      } else if (budgetsResponse.error) {
        console.error('Error fetching budgets:', budgetsResponse.error);
      }

      if (goalsResponse.data) {
        setGoals(goalsResponse.data.goals || []);
      } else if (goalsResponse.error) {
        console.error('Error fetching goals:', goalsResponse.error);
      }
    } catch (error) {
      console.error('Error fetching budgets and goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (values: any) => {
    try {
      const response = await api.createBudget(values);

      if (response.data) {
        setBudgets(prev => [response.data.budget, ...prev]);
      } else if (response.error) {
        console.error('Failed to add budget:', response.error);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleAddGoal = async (values: any) => {
    try {
      const response = await api.createGoal(values);

      if (response.data) {
        setGoals(prev => [response.data.goal, ...prev]);
      } else if (response.error) {
        console.error('Failed to add goal:', response.error);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  // Check if there are any budgets or goals
  const hasBudgets = budgets.length > 0;
  const hasGoals = goals.length > 0;
  const hasData = hasBudgets || hasGoals;

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading budgets and goals...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!hasData) {
    return (
      <>
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
        <BudgetForm open={openBudget} setOpen={setOpenBudget} onSubmit={handleAddBudget} />
        <GoalForm open={openGoal} setOpen={setOpenGoal} onSubmit={handleAddGoal} />
      </>
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
        <MobileDataList
          items={budgets}
          type="budgets"
          loading={loading}
          emptyState={{
            title: "No budgets yet",
            description: "Start managing your finances by creating your first budget.",
            action: {
              label: "Create Budget",
              onClick: () => setOpenBudget(true)
            }
          }}
        />
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
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>
                    Target: {goal.target_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <Progress value={progress} className="h-3" />
                   <p className="text-sm mt-2 text-muted-foreground">{progress.toFixed(1)}% complete</p>
                </CardContent>
                 <CardFooter className="flex justify-end text-sm">
                  <p>
                    <span className="font-bold">${goal.current_amount.toLocaleString()}</span> saved
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
