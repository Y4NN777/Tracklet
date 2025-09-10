'use client';

import { useState, useMemo } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const transactions = [
  { id: 'txn1', date: '2024-07-26', description: 'Monthly Rent', amount: -1500.00, category: 'Housing', status: 'Completed' },
  { id: 'txn2', date: '2024-07-25', description: 'Paycheck', amount: 2500.00, category: 'Income', status: 'Completed' },
  { id: 'txn3', date: '2024-07-24', description: 'Groceries at Whole Foods', amount: -124.50, category: 'Food', status: 'Completed' },
  { id: 'txn4', date: '2024-07-23', description: 'Dinner with friends', amount: -65.80, category: 'Social', status: 'Completed' },
  { id: 'txn5', date: '2024-07-22', description: 'Gym Membership', amount: -40.00, category: 'Health', status: 'Completed' },
  { id: 'txn6', date: '2024-07-21', description: 'Amazon Purchase', amount: -89.99, category: 'Shopping', status: 'Completed' },
  { id: 'txn7', date: '2024-07-20', description: 'Utility Bill', amount: -75.00, category: 'Utilities', status: 'Completed' },
  { id: 'txn8', date: '2024-07-19', description: 'Stock Dividend', amount: 50.25, category: 'Investment', status: 'Completed' },
  { id: 'txn9', date: '2024-07-18', description: 'Coffee at Starbucks', amount: -5.75, category: 'Food', status: 'Completed' },
  { id: 'txn10', date: '2024-07-17', description: 'Movie Tickets', amount: -32.00, category: 'Entertainment', status: 'Completed' },
];

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const handleAddTransaction = (values: any) => {
    // TODO: Implement actual transaction adding logic
    console.log('Transaction values:', values);
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(txn =>
        `"${txn.date}","${txn.description}","${txn.category}",${txn.amount},"${txn.status}"`
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
    const uniqueCategories = [...new Set(transactions.map(txn => txn.category))];
    return ['all', ...uniqueCategories];
  }, []);

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search filter
      const matchesSearch =
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || txn.category === categoryFilter;
      
      // Date range filter
      const txnDate = new Date(txn.date);
      const matchesDateRange =
        (!dateRange.from || txnDate >= dateRange.from) &&
        (!dateRange.to || txnDate <= dateRange.to);
      
      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [searchTerm, categoryFilter, dateRange]);

  // Check if there are any transactions
  const hasTransactions = filteredTransactions.length > 0;

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage all your transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
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

