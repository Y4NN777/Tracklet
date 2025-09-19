'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { getFinancialInsightsAction, type InsightsState } from '@/lib/actions/insights';
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
import { Lightbulb, Bot, Trash2, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { formatMarkdown } from '@/lib/markdown-utils';
import { useCurrency } from '@/contexts/preferences-context';
import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const InsightsSchema = z.object({
  income: z.coerce.number().min(0, "Income must be a positive number."),
  savings: z.coerce.number().min(0, "Savings must be a positive number."),
  debt: z.coerce.number().min(0, "Debt must be a positive number.").optional(),
  financialGoals: z.string().min(5, "Please describe your financial goals."),
  expenses: z.array(z.object({
    category: z.string().min(1, 'Category is required'),
    amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  })).min(1, "Please add at least one expense."),
  currency: z.string().min(1, "Currency is required."),
});

type InsightsFormValues = z.infer<typeof InsightsSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Generating...' : 'Get Insights'}
      <Lightbulb className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialState: InsightsState = {
  form: {
    income: 0,
    savings: 0,
    debt: 0,
    financialGoals: "",
    expenses: [
      { category: "", amount: 0 },
    ],
    currency: "USD",
  },
  error: undefined,
  result: undefined,
};

export function InsightsForm() {
  const [state, formAction] = useActionState(getFinancialInsightsAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { currency } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<InsightsFormValues>({
    resolver: zodResolver(InsightsSchema),
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
    <div className={`grid gap-8 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      {!isExpanded && (
        <Card className="w-full">
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>
            Provide your financial details to receive AI-powered insights.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="currency" value={currency} />
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
      )}
      <div className={`space-y-4 ${isExpanded ? 'w-full' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Generated Insights
          </h3>
          {state.result && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  Collapse
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </>
              )}
            </Button>
          )}
        </div>
        {state.result ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none prose-headings:mb-4 prose-p:mb-3 prose-ul:mb-3 prose-ol:mb-3"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(state.result.spendingPatterns) }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Potential Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none prose-headings:mb-4 prose-p:mb-3 prose-ul:mb-3 prose-ol:mb-3"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(state.result.potentialSavings) }}
                  />
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Investment Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none prose-headings:mb-4 prose-p:mb-3 prose-ul:mb-3 prose-ol:mb-3"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(state.result.investmentOpportunities) }}
                  />
                </CardContent>
              </Card>
            </div>
        ) : (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Waiting for input</AlertTitle>
              <AlertDescription>
                Your personalized financial insights will appear here once you
                submit your details.
              </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
