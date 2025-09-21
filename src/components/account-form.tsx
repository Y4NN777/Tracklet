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

type AccountFormValues = z.infer<ReturnType<typeof getAccountSchema>>;

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

interface AccountFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: AccountFormValues) => void;
  editingAccount?: Account | null;
  onClose?: () => void;
}

const getAccountSchema = (i: any) => z.object({
  name: z.string().min(2, {
    message: i.nameMinLength,
  }),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    required_error: i.typeRequired,
  }),
  balance: z.coerce.number({
    required_error: i.balanceRequired,
  }),
  currency: z.string().min(3, {
    message: i.currencyRequired,
  }),
});

export function AccountForm({ open, setOpen, onSubmit, editingAccount, onClose }: AccountFormProps) {
  const i = useIntlayer('account-form');
  const { toast } = useToast();
  const { currency } = useCurrency();

  const accountSchema = getAccountSchema(i);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "checking",
      balance: 0,
      currency: currency,
    },
  })

  // Handle editing mode
  useEffect(() => {
    if (editingAccount) {
      form.reset({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance,
        currency: currency,
      });
    } else {
      form.reset({
        name: "",
        type: "checking",
        balance: 0,
        currency: currency,
      });
    }
  }, [editingAccount, form, currency]);

  function handleClose() {
    form.reset();
    setOpen(false);
    if (onClose) onClose();
  }

  async function onSubmitHandler(values: AccountFormValues) {
    try {
      await onSubmit(values);
      toast({
        title: i.accountAddedTitle,
        description: i.accountAddedDescription,
      })
      handleClose();
    } catch (error) {
      // console.error('Account creation failed:', error);
      toast({
        title: i.errorTitle,
        description: error instanceof Error ? error.message : i.failedToCreateAccount,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAccount ? i.editAccountTitle : i.addAccountTitle}</DialogTitle>
          <DialogDescription>
            {editingAccount
              ? i.updateAccountDescription
              : i.addAccountDescription
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
                  <FormLabel>{i.accountNameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.accountNamePlaceholder.key} {...field} />
                  </FormControl>
                  <FormDescription>
                    {i.accountNameDescription}
                  </FormDescription>
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
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{i.selectAccountTypeOption}</option>
                      <option value="checking">{i.checkingAccountOption}</option>
                      <option value="savings">{i.savingsAccountOption}</option>
                      <option value="credit">{i.creditCardOption}</option>
                      <option value="investment">{i.investmentAccountOption}</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    {i.accountTypeDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.currentBalanceLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {i.currentBalanceDescription}
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
                  <FormLabel>{i.currencyLabel}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-not-allowed"
                      style={{ pointerEvents: 'none' }}
                    >
                      <option value={currency}>{currency}</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    {i.currencyDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{editingAccount ? i.updateAccountButton : i.addAccountButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}