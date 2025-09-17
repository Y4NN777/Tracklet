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
  currency: z.string().min(3, {
    message: "Currency must be selected.",
  }),
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
      currency: currency, // Use user's selected currency
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
        currency: currency, // Use user's selected currency for editing
      });
    } else {
      form.reset({
        name: "",
        amount: 0,
        period: undefined,
        category_id: "",
        start_date: undefined,
        currency: currency,
      });
    }
  }, [editingBudget, form, currency]);

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
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {/* Major Global Currencies */}
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>

                      {/* Middle East High Value and Regional Currencies */}
                      <option value="KWD">KWD - Kuwaiti Dinar</option>
                      <option value="BHD">BHD - Bahraini Dinar</option>
                      <option value="OMR">OMR - Omani Rial</option>
                      <option value="JOD">JOD - Jordanian Dinar</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="AED">AED - UAE Dirham</option>

                      {/* Americas and Asia-Pacific */}
                      <option value="MXN">MXN - Mexican Peso</option>
                      <option value="BRL">BRL - Brazilian Real</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="HKD">HKD - Hong Kong Dollar</option>
                      <option value="NZD">NZD - New Zealand Dollar</option>

                      {/* Europe Regional Currencies */}
                      <option value="NOK">NOK - Norwegian Krone</option>
                      <option value="SEK">SEK - Swedish Krona</option>
                      <option value="TRY">TRY - Turkish Lira</option>
                      <option value="RUB">RUB - Russian Ruble</option>

                      {/* African Currencies */}
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="XOF">XOF - West African CFA franc</option>
                      <option value="XAF">XAF - Central African CFA franc</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                    </select>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{editingBudget ? 'Update Budget' : 'Add Budget'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}