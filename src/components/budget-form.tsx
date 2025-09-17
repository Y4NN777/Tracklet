 'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/preferences-context';

const budgetSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.coerce.number()
    .gt(0, { message: "Amount must be greater than 0." }),
  period: z.enum(['monthly', 'weekly', 'yearly'], {
    required_error: "Please select a budget period.",
  }),
  category_id: z.string().optional(),
  start_date: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>

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
  const { toast } = useToast();
  const { currency } = useCurrency();
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
          <DialogTitle>{editingBudget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
          <DialogDescription>
            {editingBudget
              ? 'Update your budget information.'
              : 'Add a new budget to track your finances.'
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" type="number" {...field} />
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
                  <FormLabel>Budget Period</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select period</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    How often this budget resets.
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
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When this budget period starts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Currency
              </label>
              <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {currency} - {currency === 'USD' ? 'US Dollar' : currency === 'EUR' ? 'Euro' : currency === 'GBP' ? 'British Pound' : currency === 'JPY' ? 'Japanese Yen' : currency === 'CAD' ? 'Canadian Dollar' : currency === 'AUD' ? 'Australian Dollar' : currency === 'CHF' ? 'Swiss Franc' : currency === 'CNY' ? 'Chinese Yuan' : currency === 'INR' ? 'Indian Rupee' : currency}
              </div>
              <p className="text-xs text-muted-foreground">
                Currency is set based on your preferences and cannot be changed here.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit">{editingBudget ? 'Update Budget' : 'Add Budget'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}