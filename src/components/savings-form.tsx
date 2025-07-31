'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { getSavingsOpportunitiesAction, type SavingsState } from '@/lib/actions/savings';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Bot, Trash2, PlusCircle, ThumbsUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

const SavingsSchema = z.object({
  income: z.coerce.number().min(0, "Income must be a positive number."),
  savings: z.coerce.number().min(0, "Savings must be a positive number."),
  debt: z.coerce.number().min(0, "Debt must be a positive number."),
  financialGoals: z.string().min(5, "Please describe your financial goals."),
  expenses: z.array(z.object({
    category: z.string().min(1, 'Category is required'),
    amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  })).min(1, "Please add at least one expense."),
});

type SavingsFormValues = z.infer<typeof SavingsSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Analyzing...' : 'Get Recommendations'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialState: SavingsState = {
  form: {
    income: 5000,
    savings: 10000,
    debt: 2500,
    financialGoals: "Save for a down payment and build an emergency fund.",
    expenses: [
      { category: "Rent", amount: 1500 },
      { category: "Groceries", amount: 400 },
      { category: "Car Payment", amount: 300 },
    ],
  },
  error: undefined,
  result: undefined,
};

export function SavingsForm() {
  const [state, formAction] = useActionState(getSavingsOpportunitiesAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<SavingsFormValues>({
    resolver: zodResolver(SavingsSchema),
    defaultValues: initialState.form,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state.error, toast]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Savings Advisor</CardTitle>
          <CardDescription>
            Provide your financial details to get personalized savings tips.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction} onSubmit={handleSubmit(() => formRef.current?.requestSubmit())}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Controller
                name="income"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income</Label>
                    <Input id="income" type="number" placeholder="5000" {...field} />
                    {errors.income && <p className="text-sm text-destructive">{errors.income.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="savings"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="savings">Total Savings</Label>
                    <Input id="savings" type="number" placeholder="10000" {...field} />
                     {errors.savings && <p className="text-sm text-destructive">{errors.savings.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="debt"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="debt">Total Debt</Label>
                    <Input id="debt" type="number" placeholder="2500" {...field} />
                     {errors.debt && <p className="text-sm text-destructive">{errors.debt.message}</p>}
                  </div>
                )}
              />
            </div>
            
            <div>
              <Label>Monthly Expenses</Label>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                        name={`expenses.${index}.category`}
                        control={control}
                        render={({ field }) => <Input placeholder="Category (e.g., Rent)" {...field} name="expenseCategory" />}
                    />
                    <Controller
                        name={`expenses.${index}.amount`}
                        control={control}
                        render={({ field }) => <Input type="number" placeholder="Amount" {...field} name="expenseAmount" />}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 {errors.expenses && <p className="text-sm text-destructive">{errors.expenses.message || errors.expenses.root?.message}</p>}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ category: '', amount: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>

            <Controller
              name="financialGoals"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="financialGoals">Financial Goals</Label>
                  <Textarea
                    id="financialGoals"
                    placeholder="e.g., Save for a house, pay off debt, invest for retirement."
                    rows={3}
                    {...field}
                  />
                   {errors.financialGoals && <p className="text-sm text-destructive">{errors.financialGoals.message}</p>}
                </div>
              )}
            />
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Recommendations
        </h3>
        {state.result ? (
            <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary"><ThumbsUp/> Here are your personalized tips!</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-foreground">
                    <p>{state.result.savingsOpportunities}</p>
                </CardContent>
            </Card>
        ) : (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Waiting for input</AlertTitle>
              <AlertDescription>
                Your personalized savings opportunities will appear here once you
                submit your financial details.
              </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
