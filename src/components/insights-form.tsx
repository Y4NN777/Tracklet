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
import { useIntlayer } from 'next-intlayer';

const getInsightsSchema = (i: any) => z.object({
  income: z.coerce.number().min(0, i.incomeMin.key),
  savings: z.coerce.number().min(0, i.savingsMin.key),
  debt: z.coerce.number().min(0, i.debtMin.key).optional(),
  financialGoals: z.string().min(5, i.financialGoalsMin.key),
  expenses: z.array(z.object({
    category: z.string().min(1, i.categoryRequired.key),
    amount: z.coerce.number().min(0.01, i.amountMin.key),
  })).min(1, i.expensesMin.key),
  currency: z.string().min(1, i.currencyRequired.key),
});

type InsightsFormValues = z.infer<ReturnType<typeof getInsightsSchema>>;

function SubmitButton() {
  const i = useIntlayer('insights-form');
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? i.generating : i.getInsights}
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
    locale: "en",
  },
  error: undefined,
  result: undefined,
};

export function InsightsForm() {
  const i = useIntlayer('insights-form');
  const [state, formAction] = useActionState(getFinancialInsightsAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { currency } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const InsightsSchema = getInsightsSchema(i);

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
        title: i.error.key,
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state.error, toast, i.error]);

  return (
    <div className={`grid gap-8 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      {!isExpanded && (
        <Card className="w-full">
        <CardHeader>
          <CardTitle>{i.financialInsights}</CardTitle>
          <CardDescription>
            {i.formDescription}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="currency" value={currency} />
          <input type="hidden" name="locale" value={i.locale} />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Controller
                name="income"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="income">{i.monthlyIncome}</Label>
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
                    <Label htmlFor="savings">{i.totalSavings}</Label>
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
                    <Label htmlFor="debt">{i.totalDebt}</Label>
                    <Input id="debt" type="number" placeholder="2500" {...field} />
                     {errors.debt && <p className="text-sm text-destructive">{errors.debt.message}</p>}
                  </div>
                )}
              />
            </div>
            
            <div>
              <Label>{i.monthlyExpenses}</Label>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                        name={`expenses.${index}.category`}
                        control={control}
                        render={({ field }) => <Input placeholder={i.categoryPlaceholder.key} {...field} name="expenseCategory" />}
                    />
                    <Controller
                        name={`expenses.${index}.amount`}
                        control={control}
                        render={({ field }) => <Input type="number" placeholder={i.amountPlaceholder.key} {...field} name="expenseAmount" />}
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
                {i.addExpense}
              </Button>
            </div>

            <Controller
              name="financialGoals"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="financialGoals">{i.financialGoals}</Label>
                  <Textarea
                    id="financialGoals"
                    placeholder={i.financialGoalsPlaceholder.key}
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
              {i.aiGeneratedInsights}
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
                  {i.collapse}
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  {i.expand}
                </>
              )}
            </Button>
          )}
        </div>
        {state.result ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{i.spendingPatterns}</CardTitle>
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
                  <CardTitle>{i.potentialSavings}</CardTitle>
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
                  <CardTitle>{i.investmentOpportunities}</CardTitle>
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
              <AlertTitle>{i.waitingForInput}</AlertTitle>
              <AlertDescription>
                {i.waitingForInputDescription}
              </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
