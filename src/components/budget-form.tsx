'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useIntlayer } from 'next-intlayer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/preferences-context';

const getBudgetSchema = (i: any) => z.object({
  name: z.string().min(2, {
    message: i.nameMinLength,
  }),
  amount: z.coerce.number()
    .gt(0, { message: i.amountGreaterThanZero }),
  period: z.enum(['monthly', 'weekly', 'yearly'], {
    required_error: i.periodRequired,
  }),
  category_id: z.string().optional(),
  start_date: z.string().optional(),
});

type BudgetFormValues = z.infer<ReturnType<typeof getBudgetSchema>>

interface Budget {
  id: string;
  name: string;
  amount: number;
  period: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  categories?: {
    name: string;
  };
}

interface BudgetFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: BudgetFormValues) => void;
  editingBudget?: Budget | null;
  onClose?: () => void;
}

export function BudgetForm({ open, setOpen, onSubmit, editingBudget, onClose }: BudgetFormProps) {
  const i = useIntlayer('budget-form');
  const { toast } = useToast();
  const { currency } = useCurrency();
  const budgetSchema = getBudgetSchema(i);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
      period: undefined,
      category_id: "",
      start_date: "",
    },
  })

  // Handle editing mode
  useEffect(() => {
    if (editingBudget) {
      form.reset({
        name: editingBudget.name,
        amount: editingBudget.amount,
        period: editingBudget.period as 'monthly' | 'weekly' | 'yearly',
        category_id: editingBudget.category_id || "",
        start_date: editingBudget.start_date || "",
      });
    } else {
      form.reset({
        name: "",
        amount: 0,
        period: undefined,
        category_id: "",
        start_date: undefined,
      });
    }
  }, [editingBudget, form]);

  function handleClose() {
    form.reset();
    setOpen(false);
    if (onClose) onClose();
  }

  function onSubmitHandler(values: BudgetFormValues) {
    onSubmit(values);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingBudget ? i.editBudget : i.addBudget}</DialogTitle>
          <DialogDescription>
            {editingBudget
              ? i.updateBudgetInfo
              : i.addBudgetToTrack
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.name}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.amount}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.amount} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.budgetPeriod}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{i.selectPeriod}</option>
                      <option value="weekly">{i.weekly}</option>
                      <option value="monthly">{i.monthly}</option>
                      <option value="yearly">{i.yearly}</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    {i.periodDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.startDate}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    {i.startDateDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {i.currency}
              </label>
              <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {currency}
              </div>
              <p className="text-xs text-muted-foreground">
                {i.currencyDescription}
              </p>
            </div>
            <DialogFooter>
              <Button type="submit">{editingBudget ? i.updateBudget : i.addBudgetButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}