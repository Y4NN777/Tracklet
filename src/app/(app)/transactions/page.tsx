'use client';

import { useState, useMemo, useEffect } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.getTransactions();

      if (response.data) {
        setTransactions(response.data.transactions || []);
      } else if (response.error) {
        console.error('Error fetching transactions:', response.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
      };

      const response = await api.createTransaction(transactionData);

      if (response.data) {
        console.log('Transaction added:', response.data.transaction);
        // Refresh transactions list
        await fetchTransactions();
      } else if (response.error) {
        console.error('Failed to add transaction:', response.error);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Account', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(txn =>
        `"${txn.date}","${txn.description}","${txn.categories?.name || 'Uncategorized'}","${txn.accounts?.name || 'No Account'}",${txn.amount},"${txn.type}"`
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <TransactionForm open={open} setOpen={setOpen} onSubmit={handleAddTransaction} />
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
            <Button variant="outline" onClick={exportToCSV} className="w-full sm:w-auto">
              Export Data
            </Button>
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

