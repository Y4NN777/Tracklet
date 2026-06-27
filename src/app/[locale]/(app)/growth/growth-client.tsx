'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, PiggyBank, Sparkles } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { BudgetForm } from '@/components/budget-form';
import { GoalForm } from '@/components/goal-form';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { BudgetCard } from '@/components/ui/mobile-data-card';
import { SavingsForm } from "@/components/savings-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createBudget, updateBudget, deleteBudget, createGoal } from "@/lib/actions/growth";
import { useToast } from "@/hooks/use-toast";

export function GrowthClient({ initialData }: { initialData: any }) {
  const i = useIntlayer('main-nav');
  const { toast } = useToast();
  const [openBudget, setOpenBudget] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const handleAddBudget = async (values: any) => {
    try {
      await createBudget(values);
      toast({ title: "Success", description: "Budget created" });
      setOpenBudget(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleUpdateBudget = async (values: any) => {
    try {
      await updateBudget(editingBudget.id, values);
      toast({ title: "Success", description: "Budget updated" });
      setEditingBudget(null);
      setOpenBudget(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      toast({ title: "Success", description: "Budget deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{i.growth}</h1>
        <p className="text-muted-foreground text-lg">Plan your future and optimize savings with AI.</p>
      </div>

      <Tabs defaultValue="budgets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl">
          <TabsTrigger value="budgets" className="flex items-center gap-2 py-3 text-base">
            <Target className="h-5 w-5" />
            Budgets
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2 py-3 text-base">
            <PiggyBank className="h-5 w-5" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2 py-3 text-base text-primary">
            <Sparkles className="h-5 w-5" />
            AI Savings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="mt-0 outline-none">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">Your Budgets</h2>
             <Button onClick={() => setOpenBudget(true)} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> New Budget
             </Button>
          </div>
          <MobileDataList
            items={initialData.budgets}
            type="budgets"
            renderCard={(budget: any) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={() => { setEditingBudget(budget); setOpenBudget(true); }}
                onDelete={() => handleDeleteBudget(budget.id)}
              />
            )}
          />
        </TabsContent>

        <TabsContent value="goals" className="mt-0 outline-none">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">Savings Goals</h2>
             <Button onClick={() => setOpenGoal(true)} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> New Goal
             </Button>
          </div>
          <MobileDataList
            items={initialData.goals}
            type="generic"
            renderCard={(goal: any) => (
              <div key={goal.id} className="p-4 bg-card border rounded-xl shadow-sm mb-4">
                 <h3 className="font-bold">{goal.name}</h3>
                 <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-0 outline-none">
           <SavingsForm />
        </TabsContent>
      </Tabs>

      <BudgetForm
        open={openBudget}
        setOpen={setOpenBudget}
        onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
        editingBudget={editingBudget}
        categories={initialData.categories}
        onClose={() => { setOpenBudget(false); setEditingBudget(null); }}
      />
      <GoalForm open={openGoal} setOpen={setOpenGoal} onSubmit={async (v: any) => {
          try {
            await createGoal(v);
            setOpenGoal(false);
            toast({ title: "Success", description: "Goal created" });
          } catch(e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
          }
      }} />
    </div>
  );
}
