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
  use_manual_override: z.boolean().optional(),
  manual_balance: z.coerce.number().optional(),
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
      use_manual_override: false,
      manual_balance: 0,
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
          use_manual_override: editingAccount.manualOverrideActive || false,
          manual_balance: editingAccount.manualBalance || 0,
        });
      } else {
        form.reset({
          name: "",
          type: "bank_account",
          balance: 0,
          currency: currency,
          is_savings: false,
          use_manual_override: false,
          manual_balance: 0,
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
        <form onSubmit={form.handleSubmit((v) => { onSubmit(v); setOpen(false); })} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{i.accountNameLabel}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{i.accountTypeLabel}</FormLabel>
                <FormControl>
                  <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="bank_account">Bank Account</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit Card</option>
                    <option value="investment">Investment</option>
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
                  <FormLabel>{i.currentBalanceLabel}</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="is_savings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{i.isSavingsAccountLabel}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {editingAccount ? i.updateAccountButton : i.addAccountButton}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
}
