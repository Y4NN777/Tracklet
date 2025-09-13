'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';

const transactionSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number()
    .gt(0, { message: "Amount must be greater than 0." }),
  category_id: z.string().min(1, {
    message: "Category must be selected.",
  }),
  account_id: z.string().min(1, {
    message: "Account must be selected.",
  }),
  date: z.date(),
  currency: z.string().min(3, {
    message: "Currency must be selected.",
  }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: TransactionFormValues) => void;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}

export function TransactionForm({ open, setOpen, onSubmit }: TransactionFormProps) {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category_id: "",
      account_id: "",
      date: new Date(),
      currency: "USD", // Default currency
    },
  })

  // Fetch accounts and categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchAccountsAndCategories();
    }
  }, [open]);

  const fetchAccountsAndCategories = async () => {
    setLoading(true);
    try {
      const [accountsResponse, categoriesResponse] = await Promise.all([
        api.getAccounts(),
        api.getCategories()
      ]);

      if (accountsResponse.data) {
        setAccounts(accountsResponse.data.accounts || []);
      } else if (accountsResponse.error) {
        console.error('Error fetching accounts:', accountsResponse.error);
      }

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data.categories || []);
      } else if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
      }
    } catch (error) {
      console.error('Error fetching accounts and categories:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleClose() {
    form.reset();
    setOpen(false);
  }

  function onSubmitHandler(values: TransactionFormValues) {
    onSubmit(values);
    toast({
      title: "Transaction added.",
      description: "Your transaction has been added successfully.",
    })
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to track your finances.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name} ({category.type})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose the category for this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loading}
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} ({account.type}) - {account.balance.toLocaleString('en-US', { style: 'currency', currency: account.currency })}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose the account for this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
               control={form.control}
               name="date"
               render={({ field }) => (
                 <FormItem className="flex flex-col">
                   <FormLabel>Date</FormLabel>
                   <Popover>
                     <PopoverTrigger asChild>
                       <FormControl>
                         <Button
                           variant={"outline"}
                           className={cn(
                             "w-full pl-3 text-left font-normal",
                             !field.value && "text-muted-foreground"
                           )}
                         >
                           {field.value ? (
                             format(field.value, "PPP")
                           ) : (
                             <span>Pick a date</span>
                           )}
                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                         </Button>
                       </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                         mode="single"
                         selected={field.value}
                         onSelect={field.onChange}
                         initialFocus
                       />
                     </PopoverContent>
                   </Popover>
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
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}