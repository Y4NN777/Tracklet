'use client';

import { useState } from 'react';
import { TransactionForm } from '@/components/transaction-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

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

  const handleAddTransaction = (values: any) => {
    // TODO: Implement actual transaction adding logic
    console.log('Transaction values:', values);
  };

  // Check if there are any transactions
  const hasTransactions = transactions.length > 0;

  if (!hasTransactions) {
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage all your transactions.</CardDescription>
          </div>
          <Button onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{txn.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{txn.category}</Badge>
                </TableCell>
                <TableCell>
                   <Badge variant={txn.status === "Completed" ? "default" : "secondary"} className={txn.status === "Completed" ? "bg-accent text-accent-foreground" : ""}>{txn.status}</Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    txn.amount > 0 ? 'text-success' : ''
                  }`}
                >
                  {txn.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Categorize</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      </Card>
      <TransactionForm open={open} setOpen={setOpen} onSubmit={handleAddTransaction} />
    </>
    );
}

