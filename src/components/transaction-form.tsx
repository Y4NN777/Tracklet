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
import { useCurrency } from '@/contexts/preferences-context';
import { calculateAccountBalance } from '@/lib/financial-calculations';
import { supabase } from '@/lib/supabase';
import {
  DollarSign,
  CreditCard,
  Home,
  Car,
  UtensilsCrossed,
  Film,
  ShoppingBag,
  Lightbulb,
  Stethoscope,
  BookOpen,
  Plane,
  Music,
  Gamepad2,
  Monitor,
  Smartphone,
  Dumbbell,
  Circle,
  Palette,
  Theater,
  Pizza,
  Coffee,
  Beer,
  Umbrella,
  Snowflake,
  TreePine,
  Gift,
  Briefcase,
  Building,
  Store,
  Tag
} from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 5 characters.",
  }),
  amount: z.coerce.number()
    .gt(0, { message: "Amount must be greater than 0." }),
  type: z.enum(['income', 'expense', 'transfer'], {
    required_error: "Please select a transaction type.",
  }),
  category_id: z.string().optional(),
  account_id: z.string().min(1, {
    message: "Account must be selected.",
  }),
  date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  accounts?: {
    id: string;
    name: string;
    type: string;
  };
}

interface TransactionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: TransactionFormValues) => void;
  editingTransaction?: Transaction | null;
  onClose?: () => void;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  calculatedBalance?: number;
}

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}

const iconComponents = {
  DollarSign,
  CreditCard,
  Home,
  Car,
  UtensilsCrossed,
  Film,
  ShoppingBag,
  Lightbulb,
  Stethoscope,
  BookOpen,
  Plane,
  Music,
  Gamepad2,
  Monitor,
  Smartphone,
  Dumbbell,
  Circle,
  Palette,
  Theater,
  Pizza,
  Coffee,
  Beer,
  Umbrella,
  Snowflake,
  TreePine,
  Gift,
  Briefcase,
  Building,
  Store
};

export function TransactionForm({ open, setOpen, onSubmit, editingTransaction, onClose }: TransactionFormProps) {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: undefined,
      category_id: "",
      account_id: "",
      date: new Date(),
    },
  })

  // Fetch accounts and categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchAccountsAndCategories();
    }
  }, [open]);

  // Handle editing mode
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category_id: editingTransaction.categories?.id || "",
        account_id: editingTransaction.accounts?.id || "",
        date: new Date(editingTransaction.date),
      });
    } else {
      form.reset({
        description: "",
        amount: 0,
        type: undefined,
        category_id: "",
        account_id: "",
        date: new Date(),
      });
    }
  }, [editingTransaction, form]);

  // Set up real-time updates for account balances
  useEffect(() => {
    if (!open) return;

    const setupRealtimeUpdates = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Subscribe to transaction changes to refresh account balances
      const subscription = supabase
        .channel('transaction-form-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${session.user.id}`
        }, () => {
          // Refresh accounts when transactions change
          fetchAccountsAndCategories();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanup = setupRealtimeUpdates();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [open]);

  const fetchAccountsAndCategories = async () => {
    setLoading(true);
    try {
      const [accountsResponse, categoriesResponse] = await Promise.all([
        api.getAccounts(),
        api.getCategories()
      ]);

      if (accountsResponse.data) {
        const accountsData = accountsResponse.data.accounts || [];

        // Calculate balances for each account
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const accountsWithBalances = await Promise.all(
            accountsData.map(async (account: Account) => {
              try {
                const calculatedBalance = await calculateAccountBalance(account.id, session.user.id);
                return {
                  ...account,
                  calculatedBalance
                };
              } catch (error) {
//                console.error(`Error calculating balance for account ${account.id}:`, error);
                return {
                  ...account,
                  calculatedBalance: account.balance || 0 // Fallback to stored balance
                };
              }
            })
          );
          setAccounts(accountsWithBalances);
        } else {
          setAccounts(accountsData);
        }
      } else if (accountsResponse.error) {
//        console.error('Error fetching accounts:', accountsResponse.error);
      }

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data.categories || []);
      } else if (categoriesResponse.error) {
//        console.error('Error fetching categories:', categoriesResponse.error);
      }
    } catch (error) {
//      console.error('Error fetching accounts and categories:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleClose() {
    form.reset();
    setOpen(false);
    if (onClose) onClose();
  }

  function onSubmitHandler(values: TransactionFormValues) {
    onSubmit(values);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogDescription>
            {editingTransaction
              ? 'Update your transaction information.'
              : 'Add a new transaction to track your finances.'
            }
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select transaction type</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose whether this is income, expense, or transfer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (optional)</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose the category for this transaction (optional).
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
                          {account.name} ({account.type}) - {(account.calculatedBalance ?? account.balance).toLocaleString('en-US', { style: 'currency', currency: account.currency })}
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
             <div className="space-y-2">
               <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                 Currency
               </label>
               <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                 {currency}
               </div>
               <p className="text-xs text-muted-foreground">
                 Currency is set based on your preferences and cannot be changed here.
               </p>
             </div>
            <DialogFooter>
              <Button type="submit">{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}