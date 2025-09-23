'use client';

import { useState } from 'react';
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

interface GoalFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: any) => void;
}

export function GoalForm({ open, setOpen, onSubmit }: GoalFormProps) {
  const i = useIntlayer('goal-form');
  const { toast } = useToast();
  const { currency } = useCurrency();

  const getGoalSchema = (i: any) => z.object({
    name: z.string().min(2, {
      message: i.nameMinLength.key,
    }),
    targetAmount: z.coerce.number()
      .gt(0, { message: i.targetAmountGreaterThanZero.key }),
    currentAmount: z.coerce.number()
      .min(0, { message: i.currentAmountMin.key }),
  });

  type GoalFormValues = z.infer<ReturnType<typeof getGoalSchema>>

  const goalSchema = getGoalSchema(i);

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
      title: i.goalAdded,
      description: i.goalAddedSuccess,
    })
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{i.addGoal}</DialogTitle>
          <DialogDescription>
            {i.addGoalDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i.name}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.namePlaceholder.key} {...field} />
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
                  <FormLabel>{i.targetAmount}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.targetAmountPlaceholder.key} type="number" {...field} />
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
                  <FormLabel>{i.currentAmount}</FormLabel>
                  <FormControl>
                    <Input placeholder={i.currentAmountPlaceholder.key} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {i.currency}
              </label>
              <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {currency}
              </div>
              <p className="text-xs text-muted-foreground">
                {i.currencyDescription}
              </p>
            </div>
            <DialogFooter>
              <Button type="submit">{i.addGoalButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}