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
import { Checkbox } from "@/components/ui/checkbox";
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

const getAccountSchema = (i: any, editingAccount?: any) => z.object({
  name: z.string().min(2, {
    message: i.nameMinLength.key,
  }),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    required_error: i.typeRequired.key,
  }),
  balance: editingAccount ? z.coerce.number().optional() : z.coerce.number({
    required_error: i.balanceRequired.key,
  }),
  currency: z.string().min(3, {
    message: i.currencyRequired.key,
  }),
  is_savings: z.boolean().optional(),
  use_manual_override: z.boolean().optional(),
  manual_balance: z.coerce.number().optional(),
  manual_balance_note: z.string().optional(),
}).refine((data) => {
  if (data.use_manual_override && data.manual_balance === undefined) {
    return false;
  }
  return true;
}, {
  message: i.manualBalanceRequired.key,
  path: ["manual_balance"],
});

export function AccountForm({ open, setOpen, onSubmit, editingAccount, onClose }: AccountFormProps) {
  const i = useIntlayer('account-form');
  const { toast } = useToast();
  const { currency } = useCurrency();

  const accountSchema = getAccountSchema(i, editingAccount);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "checking",
      balance: 0,
      currency: currency,
      is_savings: false,
      use_manual_override: false,
      manual_balance: undefined,
      manual_balance_note: "",
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
        is_savings: (editingAccount as any).is_savings || false,
        use_manual_override: (editingAccount as any).manualOverrideActive || false,
        manual_balance: (editingAccount as any).manualBalance,
        manual_balance_note: (editingAccount as any).lastManualSet ? `Manual balance set on ${(editingAccount as any).lastManualSet}` : "",
      });
    } else {
      form.reset({
        name: "",
        type: "checking",
        balance: 0,
        currency: currency,
        is_savings: false,
        use_manual_override: false,
        manual_balance: undefined,
        manual_balance_note: "",
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
            {!editingAccount && (
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
            )}
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
            <FormField
              control={form.control}
              name="is_savings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {i.isSavingsAccountLabel}
                    </FormLabel>
                    <FormDescription>
                      {i.isSavingsAccountDescription}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="use_manual_override"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {i.useManualOverrideLabel}
                    </FormLabel>
                    <FormDescription>
                      Override the calculated balance with a manual value
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("use_manual_override") && (
              <>
                <FormField
                  control={form.control}
                  name="manual_balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{i.manualBalanceLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={i.manualBalancePlaceholder.key}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set a custom balance that will override the calculated value
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manual_balance_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{i.manualBalanceNoteLabel}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={i.manualBalanceNotePlaceholder.key}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional note explaining why this manual balance was set
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="submit">{editingAccount ? i.updateAccountButton : i.addAccountButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}