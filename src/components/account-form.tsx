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

const accountSchema = z.object({
  name: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    required_error: "Please select an account type.",
  }),
  balance: z.coerce.number({
    required_error: "Balance is required.",
  }),
  currency: z.string().min(3, {
    message: "Currency must be selected.",
  }),
});

type AccountFormValues = z.infer<typeof accountSchema>

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

export function AccountForm({ open, setOpen, onSubmit, editingAccount, onClose }: AccountFormProps) {
  const { toast } = useToast();
  const { currency } = useCurrency();
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
        title: "Account added.",
        description: "Your account has been added successfully.",
      })
      handleClose();
    } catch (error) {
      console.error('Account creation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
          <DialogDescription>
            {editingAccount
              ? 'Update your account information.'
              : 'Add a new financial account to track your money.'
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
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Checking, Emergency Savings" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your account a descriptive name.
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
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select account type</option>
                      <option value="checking">Checking - Primary spending account</option>
                      <option value="savings">Savings - High-interest savings</option>
                      <option value="credit">Credit Card - Credit accounts</option>
                      <option value="investment">Investment - Retirement, stocks, etc.</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    What type of financial account is this?
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
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your current account balance. Use negative values for debt.
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
                      className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-not-allowed"
                      style={{ pointerEvents: 'none' }}
                    >
                      <option value={currency}>{currency} - {currency === 'USD' ? 'US Dollar' : currency === 'EUR' ? 'Euro' : currency === 'GBP' ? 'British Pound' : currency === 'JPY' ? 'Japanese Yen' : currency === 'CAD' ? 'Canadian Dollar' : currency === 'AUD' ? 'Australian Dollar' : currency === 'CHF' ? 'Swiss Franc' : currency === 'CNY' ? 'Chinese Yuan' : currency === 'INR' ? 'Indian Rupee' : currency}</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Currency is set based on your preferences and cannot be changed here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{editingAccount ? 'Update Account' : 'Add Account'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}