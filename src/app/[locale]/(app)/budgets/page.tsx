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
import { BudgetCard } from '@/components/ui/mobile-data-card';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/preferences-context';
import { useIntlayer } from 'next-intlayer';

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  categories?: {
    name: string;
  };
  // Enhanced metrics
  spending_velocity?: number;
  projected_overspend_date?: string;
  days_remaining?: number;
  period_comparison?: number;
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
  const i = useIntlayer('budgets-page');
  const [openBudget, setOpenBudget] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();

  // Fetch budgets and goals on component mount
  useEffect(() => {
    fetchBudgetsAndGoals();
  }, []);

  const fetchBudgetsAndGoals = async () => {
    setLoading(true);
    try {
      const [budgetsResponse, goalsResponse, categoriesResponse] = await Promise.all([
        api.getBudgets({ include_progress: true }),
        api.getGoals({ include_progress: true }),
        api.getCategories(),
      ]);

      if (budgetsResponse.data) {
        setBudgets(budgetsResponse.data.budgets || []);
      } else if (budgetsResponse.error) {
//        console.error('Error fetching budgets:', budgetsResponse.error);
      }

      if (goalsResponse.data) {
        setGoals(goalsResponse.data.goals || []);
      } else if (goalsResponse.error) {
//        console.error('Error fetching goals:', goalsResponse.error);
      }

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data.categories || []);
      } else if (categoriesResponse.error) {
//        console.error('Error fetching categories:', categoriesResponse.error);
      }
    } catch (error) {
//      console.error('Error fetching budgets and goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (values: any) => {
    try {
      const response = await api.createBudget(values);

      if (response.data) {
        setBudgets(prev => [response.data.budget, ...prev]);
        toast({
          title: i.budgetAddedToastTitle,
          description: i.budgetAddedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to add budget:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.addBudgetFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error adding budget:', error);
      toast({
        title: i.errorToastTitle,
        description: i.addBudgetFailed,
        variant: 'destructive',
      });
    }
  };

  const handleAddGoal = async (values: any) => {
    try {
      const response = await api.createGoal(values);

      if (response.data) {
        setGoals(prev => [response.data.goal, ...prev]);
        toast({
          title: i.goalAddedToastTitle,
          description: i.goalAddedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to add goal:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.addGoalFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error adding goal:', error);
      toast({
        title: i.errorToastTitle,
        description: i.addGoalFailed,
        variant: 'destructive',
      });
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setOpenBudget(true);
  };

  const handleUpdateBudget = async (values: any) => {
    if (!editingBudget) return;

    try {
      const response = await api.updateBudget(editingBudget.id, values);

      if (response.data) {
        // Refresh budgets to get updated progress data
        await fetchBudgetsAndGoals();
        setEditingBudget(null);
        toast({
          title: i.budgetUpdatedToastTitle,
          description: i.budgetUpdatedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to update budget:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.updateBudgetFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error updating budget:', error);
      toast({
        title: i.errorToastTitle,
        description: i.updateBudgetFailed,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const response = await api.deleteBudget(budgetId);

      if (response.data || (!response.error && !response.data)) {
        // DELETE returns 204 No Content, so no data but success
        setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
        toast({
          title: i.budgetDeletedToastTitle,
          description: i.budgetDeletedToastDescription,
        });
      } else if (response.error) {
//        console.error('Failed to delete budget:', response.error);
        toast({
          title: i.errorToastTitle,
          description: i.deleteBudgetFailed,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error deleting budget:', error);
      toast({
        title: i.errorToastTitle,
        description: i.deleteBudgetFailed,
        variant: 'destructive',
      });
    }
  };

  const handleCloseBudget = () => {
    setOpenBudget(false);
    setEditingBudget(null);
  };

  // Check if there are any budgets or goals
  const hasBudgets = budgets.length > 0;
  const hasGoals = goals.length > 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{i.loading}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Always show main content structure, but show empty states for individual sections
  return (
    <>
      <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            {i.budgetsTitle}
          </h2>
          <Button onClick={() => setOpenBudget(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> {i.newBudgetButton}
          </Button>
        </div>
        <MobileDataList
          items={budgets}
          type="budgets"
          loading={loading}
          renderCard={(budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget.id)}
            />
          )}
          emptyState={{
            title: i.emptyBudgetsTitle,
            description: i.emptyBudgetsDescription,
            action: {
              label: i.createBudgetButton,
              onClick: () => setOpenBudget(true)
            }
          }}
        />
      </div>
       <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PiggyBank className="h-6 w-6" />
            {i.goalsTitle}
          </h2>
          <Button onClick={() => setOpenGoal(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> {i.newGoalButton}
          </Button>
        </div>
        {hasGoals ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <CardTitle>{goal.name}</CardTitle>
                    <CardDescription>
                      {i.goalTarget}: {formatCurrency(goal.target_amount)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Progress value={progress} className="h-3" />
                     <p className="text-sm mt-2 text-muted-foreground">{progress.toFixed(1)}% {i.goalProgress}</p>
                  </CardContent>
                   <CardFooter className="flex justify-end text-sm">
                    <p>
                      <span className="font-bold">{formatCurrency(goal.current_amount)}</span> {i.goalSaved}
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <PiggyBank className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">{i.emptyGoalsTitle}</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {i.emptyGoalsDescription}
                </p>
                <Button onClick={() => setOpenGoal(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {i.createGoalButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      <BudgetForm
        open={openBudget}
        setOpen={setOpenBudget}
        onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
        editingBudget={editingBudget}
        onClose={handleCloseBudget}
        categories={categories}
      />
      <GoalForm open={openGoal} setOpen={setOpenGoal} onSubmit={handleAddGoal} />
    </>
  );
}
