'use client';

import { useEffect } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from '@/contexts/preferences-context';
import { FormLayout } from '@/components/ui/form-layout';

const getAccountSchema = (i: any, editingAccount?: any) => z.object({
  name: z.string().min(2, { message: i.nameMinLength.key }),
  type: z.string().min(1, { message: i.typeRequired.key }),
  balance: z.coerce.number().optional(),
  currency: z.string().min(3),
  is_savings: z.boolean().optional(),
});

export function AccountForm({ open, setOpen, onSubmit, editingAccount }: any) {
  const i = useIntlayer('account-form');
  const { currency } = useCurrency();

  const form = useForm<any>({
    resolver: zodResolver(getAccountSchema(i, editingAccount)),
    defaultValues: {
      name: "",
      type: "bank_account",
      balance: 0,
      currency: currency,
      is_savings: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (editingAccount) {
        form.reset({
          name: editingAccount.name,
          type: editingAccount.type,
          balance: editingAccount.balance,
          currency: editingAccount.currency || currency,
          is_savings: editingAccount.is_savings || false,
        });
      } else {
        form.reset({
          name: "",
          type: "bank_account",
          balance: 0,
          currency: currency,
          is_savings: false,
        });
      }
    }
  }, [open, editingAccount, form, currency]);

  return (
    <FormLayout
      open={open}
      onOpenChange={setOpen}
      title={editingAccount ? i.editAccountTitle : i.addAccountTitle}
      description={editingAccount ? i.updateAccountDescription : i.addAccountDescription}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(async (v) => { await onSubmit(v); setOpen(false); })} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">{i.accountNameLabel}</FormLabel>
                <FormControl><Input placeholder="e.g. Main Savings" className="h-12 bg-muted/30 border-none shadow-inner" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
               control={form.control}
               name="type"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">{i.accountTypeLabel}</FormLabel>
                   <FormControl>
                     <select {...field} className="w-full h-12 rounded-md bg-muted/30 border-none px-3 text-sm shadow-inner">
                       <option value="bank_account">Bank Account</option>
                       <option value="savings">Savings</option>
                       <option value="credit">Credit Card</option>
                       <option value="investment">Investment</option>
                       <option value="cash">Cash</option>
                     </select>
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             {!editingAccount && (
               <FormField
                 control={form.control}
                 name="balance"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-sm font-bold uppercase tracking-wider opacity-70">{i.currentBalanceLabel}</FormLabel>
                     <FormControl><Input type="number" step="0.01" className="h-12 bg-muted/30 border-none shadow-inner font-mono text-lg" {...field} /></FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             )}
          </div>

          <FormField
            control={form.control}
            name="is_savings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl bg-primary/5 p-4 border border-primary/10">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-bold">{i.isSavingsAccountLabel}</FormLabel>
                  <p className="text-xs text-muted-foreground">Mark this as a long-term savings account.</p>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 rounded-full text-lg font-bold shadow-lg shadow-primary/20">
            {editingAccount ? "Update Account" : "Create Account"}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
}
