'use client';

import { useState, useMemo, useEffect } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Receipt, Edit, Trash2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { exportToXLSX, exportToPDF, exportToCSV } from '@/lib/export-utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userCurrency, setUserCurrency] = useState('USD');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
//        console.error('No session found');
        setLoading(false);
        return;
      }

      // Fetch user profile and transactions in parallel
      const [profileResponse, transactionsResponse] = await Promise.all([
        supabase.from('user_profiles').select('preferences').eq('id', session.user.id).single(),
        api.getTransactions()
      ]);

      // Get user's preferred currency
      if (profileResponse.data?.preferences?.currency) {
        setUserCurrency(profileResponse.data.preferences.currency);
      }

      // Get transactions
      if (transactionsResponse.data) {
        setTransactions(transactionsResponse.data.transactions || []);
      } else if (transactionsResponse.error) {
//        console.error('Error fetching transactions:', transactionsResponse.error);
      }
    } catch (error) {
//      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (values: any) => {
    try {
      // Convert date to YYYY-MM-DD format for API
      const transactionData = {
        ...values,
        date: values.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
        category_id: values.category_id || null, // Convert empty string to null
      };

      const response = await api.createTransaction(transactionData);

      if (response.data) {
//        console.log('Transaction added:', response.data.transaction);
        // Refresh transactions list
        await fetchTransactions();
        toast({
          title: 'Transaction added!',
          description: 'Your transaction has been recorded successfully.',
        });
      } else if (response.error) {
//        console.error('Failed to add transaction:', response.error);
        toast({
          title: 'Error',
          description: 'Failed to add transaction. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setOpen(true);
  };

  const handleUpdateTransaction = async (values: any) => {
    if (!editingTransaction) return;

    try {
      // Convert date to YYYY-MM-DD format for API
      const transactionData = {
        ...values,
        date: values.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD
        category_id: values.category_id || null, // Convert empty string to null
      };

      const response = await api.updateTransaction(editingTransaction.id, transactionData);

      if (response.data) {
        // Refresh transactions list
        await fetchTransactions();
        setEditingTransaction(null);
        toast({
          title: 'Transaction updated!',
          description: 'Your transaction has been updated successfully.',
        });
      } else if (response.error) {
//        console.error('Failed to update transaction:', response.error);
        toast({
          title: 'Error',
          description: 'Failed to update transaction. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const response = await api.deleteTransaction(transactionId);

      if (response.data || (!response.error && !response.data)) {
        // DELETE returns 204 No Content, so no data but success
        setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
        toast({
          title: 'Transaction deleted!',
          description: 'Your transaction has been deleted successfully.',
        });
      } else if (response.error) {
//        console.error('Failed to delete transaction:', response.error);
        toast({
          title: 'Error',
          description: 'Failed to delete transaction. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseTransaction = () => {
    setOpen(false);
    setEditingTransaction(null);
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(filteredTransactions, 'transactions', userCurrency);
      toast({
        title: 'Export successful!',
        description: 'Your transactions have been exported to CSV.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export transactions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX(filteredTransactions, 'transactions', userCurrency);
      toast({
        title: 'Export successful!',
        description: 'Your transactions have been exported to Excel.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export transactions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(filteredTransactions, 'transactions', userCurrency);
      toast({
        title: 'Export successful!',
        description: 'Your transactions have been exported to PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export transactions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(transactions.map(txn => txn.categories?.name).filter((name): name is string => Boolean(name)))];
    return ['all', ...uniqueCategories];
  }, [transactions]);

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search filter
      const matchesSearch =
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (txn.categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (txn.accounts?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === 'all' || txn.categories?.name === categoryFilter;

      // Date range filter
      const txnDate = new Date(txn.date);
      const matchesDateRange =
        (!dateRange.from || txnDate >= dateRange.from) &&
        (!dateRange.to || txnDate <= dateRange.to);

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [searchTerm, categoryFilter, dateRange, transactions]);

  // Check if there are any transactions
  const hasTransactions = filteredTransactions.length > 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Loading your transactions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage all your transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Receipt className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No transactions yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Start tracking your finances by adding your first transaction.
              </p>
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
        <TransactionForm
          open={open}
          setOpen={setOpen}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          editingTransaction={editingTransaction}
          onClose={handleCloseTransaction}
        />
      </>
    );
  }

  return (
    <>
      <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage all your transactions.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportXLSX}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Transactions display - responsive table/cards */}
        <MobileDataList
          items={filteredTransactions}
          type="transactions"
          loading={loading}
          renderCard={(transaction) => (
            <div key={transaction.id} className="relative">
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTransaction(transaction)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Card className="p-4 pr-20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Receipt className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{transaction.description}</h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        <span className="whitespace-nowrap">{format(new Date(transaction.date), 'MMM dd')}</span>
                        {transaction.categories && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate max-w-[80px] sm:max-w-none">{transaction.categories.name}</span>
                          </>
                        )}
                        {transaction.accounts && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate max-w-[80px] sm:max-w-none">{transaction.accounts.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-base sm:text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' :
                      transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {Math.abs(transaction.amount).toLocaleString('en-US', {
                        style: 'currency',
                        currency: userCurrency
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize hidden sm:block">
                      {transaction.type}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          emptyState={{
            title: "No transactions found",
            description: "Try adjusting your search or filter criteria.",
          }}
        />
      </CardContent>
      </Card>
      <TransactionForm open={open} setOpen={setOpen} onSubmit={handleAddTransaction} />
    </>
  );
}

