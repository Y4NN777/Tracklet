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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, TrendingUp, TrendingDown, Repeat } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { api } from '@/lib/api-client';
import { useCurrency } from '@/contexts/preferences-context';
import { calculateAccountBalance } from '@/lib/financial-calculations';
import { supabase } from '@/lib/supabase';
import { FormLayout } from '@/components/ui/form-layout';

const getTransactionSchema = (i: any) => z.object({
  description: z.string().min(2, { message: i.descriptionMinLength.key }),
  amount: z.coerce.number().gt(0, { message: i.amountGreaterThanZero.key }),
  type: z.enum(['income', 'expense', 'transfer'], { required_error: i.typeRequired.key }),
  category_id: z.string().optional(),
  account_id: z.string().min(1, { message: i.accountRequired.key }),
  budget_id: z.string().optional(),
  date: z.date(),
});

type TransactionFormValues = z.infer<ReturnType<typeof getTransactionSchema>>

export function TransactionForm({ open, setOpen, onSubmit, editingTransaction, onClose }: any) {
  const i = useIntlayer('transaction-form');
  const { formatCurrency } = useCurrency();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
          type: 'expense',
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
      const [acc, cat] = await Promise.all([api.getAccounts(), api.getCategories()]);
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
    } finally {
      setLoading(false);
    }
  };

  const currentType = form.watch('type');

  return (
    <FormLayout
      open={open}
      onOpenChange={setOpen}
      title={editingTransaction ? "Edit Transaction" : "New Transaction"}
    >
      <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-6">
         {['expense', 'income', 'transfer'].map((t) => (
            <Button
               key={t}
               type="button"
               variant="ghost"
               className={cn(
                  "flex-1 rounded-xl capitalize font-bold h-10",
                  currentType === t ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
               )}
               onClick={() => form.setValue('type', t as any)}
            >
               {t === 'expense' && <TrendingDown className="mr-2 h-4 w-4" />}
               {t === 'income' && <TrendingUp className="mr-2 h-4 w-4" />}
               {t === 'transfer' && <Repeat className="mr-2 h-4 w-4" />}
               {t}
            </Button>
         ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(async (v) => { await onSubmit(v); setOpen(false); })} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="text-center">
                <FormLabel className="text-sm font-bold uppercase opacity-50">How much?</FormLabel>
                <FormControl>
                  <div className="relative inline-block w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold opacity-30">$</span>
                    <Input
                       type="number"
                       step="0.01"
                       placeholder="0.00"
                       className="h-20 text-4xl font-bold text-center bg-transparent border-none focus-visible:ring-0"
                       autoFocus
                       {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase opacity-50">What for?</FormLabel>
                <FormControl><Input placeholder="e.g. Groceries, Rent, Salary" className="h-12 bg-muted/30 border-none rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
             <FormField
               control={form.control}
               name="account_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-xs font-bold uppercase opacity-50">From/To Account</FormLabel>
                   <FormControl>
                     <select {...field} className="w-full h-12 rounded-xl bg-muted/30 border-none px-3 text-sm">
                       <option value="">Select</option>
                       {accounts.map(a => (
                         <option key={a.id} value={a.id}>{a.name}</option>
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
                 <FormItem>
                   <FormLabel className="text-xs font-bold uppercase opacity-50">When?</FormLabel>
                   <Popover>
                     <PopoverTrigger asChild>
                       <FormControl>
                         <Button variant="outline" className={cn("w-full h-12 rounded-xl text-left bg-muted/30 border-none", !field.value && "text-muted-foreground")}>
                           {field.value ? format(field.value, "MMM dd, yyyy") : <span>Date</span>}
                         </Button>
                       </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="end">
                       <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                     </PopoverContent>
                   </Popover>
                   <FormMessage />
                 </FormItem>
               )}
             />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
            {editingTransaction ? "Update Transaction" : "Save Transaction"}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
}
