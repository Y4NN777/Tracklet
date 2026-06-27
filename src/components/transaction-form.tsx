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
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { api } from '@/lib/api-client';
import { useCurrency } from '@/contexts/preferences-context';
import { calculateAccountBalance } from '@/lib/financial-calculations';
import { supabase } from '@/lib/supabase';
import { FormLayout } from '@/components/ui/form-layout';

const getTransactionSchema = (i: any) => z.object({
  description: z.string().min(2, {
    message: i.descriptionMinLength.key,
  }),
  amount: z.coerce.number()
    .gt(0, { message: i.amountGreaterThanZero.key }),
  type: z.enum(['income', 'expense', 'transfer'], {
    required_error: i.typeRequired.key,
  }),
  category_id: z.string().optional(),
  account_id: z.string().min(1, {
    message: i.accountRequired.key,
  }),
  budget_id: z.string().optional(),
  date: z.date(),
});

type TransactionFormValues = z.infer<ReturnType<typeof getTransactionSchema>>

export function TransactionForm({ open, setOpen, onSubmit, editingTransaction, onClose }: any) {
  const i = useIntlayer('transaction-form');
  const { currency, formatCurrency } = useCurrency();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(getTransactionSchema(i)),
    defaultValues: {
      description: "",
      amount: 0,
      type: undefined,
      category_id: "",
      account_id: "",
      budget_id: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      fetchData();
      if (editingTransaction) {
        form.reset({
          description: editingTransaction.description,
          amount: editingTransaction.amount,
          type: editingTransaction.type,
          category_id: editingTransaction.categories?.id || "",
          account_id: editingTransaction.accounts?.id || "",
          budget_id: editingTransaction.budget_id || "",
          date: new Date(editingTransaction.date),
        });
      } else {
        form.reset({
          description: "",
          amount: 0,
          type: undefined,
          category_id: "",
          account_id: "",
          budget_id: "",
          date: new Date(),
        });
      }
    }
  }, [open, editingTransaction, form]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [acc, cat, bud] = await Promise.all([api.getAccounts(), api.getCategories(), api.getBudgets()]);
      if (acc.data) {
        const { data: { session } } = await supabase.auth.getSession();
        const accountsWithBalances = await Promise.all(
          acc.data.accounts.map(async (a: any) => ({
            ...a,
            calculatedBalance: session ? (await calculateAccountBalance(a.id, session.user.id)).balance : a.balance
          }))
        );
        setAccounts(accountsWithBalances);
      }
      if (cat.data) setCategories(cat.data.categories || []);
      if (bud.data) setBudgets(bud.data.budgets || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      open={open}
      onOpenChange={setOpen}
      title={editingTransaction ? i.editTransaction : i.addTransaction}
      description={editingTransaction ? i.updateTransactionInfo : i.addTransactionToTrack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => { onSubmit(v); setOpen(false); })} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{i.description}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.amount}</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.transactionType}</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{i.account}</FormLabel>
                <FormControl>
                  <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select Account</option>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.calculatedBalance || 0)})</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{i.date}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {editingTransaction ? i.updateTransaction : i.addTransactionButton}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
}
