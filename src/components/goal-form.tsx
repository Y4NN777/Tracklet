'use client';

import { useState } from 'react';
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

const goalSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  targetAmount: z.coerce.number()
    .gt(0, { message: "Target amount must be greater than 0." }),
  currentAmount: z.coerce.number()
    .min(0, { message: "Current amount must be 0 or greater." }),
});

type GoalFormValues = z.infer<typeof goalSchema>

interface GoalFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: GoalFormValues) => void;
}

export function GoalForm({ open, setOpen, onSubmit }: GoalFormProps) {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
    },
  })

  function handleClose() {
    form.reset();
    setOpen(false);
  }

  function onSubmitHandler(values: GoalFormValues) {
    onSubmit(values);
    toast({
      title: "Goal added.",
      description: "Your goal has been added successfully.",
    })
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Goal</DialogTitle>
          <DialogDescription>
            Add a new financial goal to track your progress.
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
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Target Amount" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Current Amount" type="number" {...field} />
                  </FormControl>
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
              <Button type="submit">Add Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}