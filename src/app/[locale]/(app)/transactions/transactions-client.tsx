'use client';

import { useState, useMemo } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Receipt, Edit, Trash2, PlusCircle, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/actions/transactions';
import { useToast } from '@/hooks/use-toast';
import { exportToXLSX, exportToPDF, exportToCSV } from '@/lib/export-utils';
import { useIntlayer } from 'next-intlayer';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Button } from '@/components/ui/button';
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

export function TransactionsClient({ initialData }: { initialData: any }) {
  const i = useIntlayer('transactions-page');
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();

  const { transactions, userCurrency } = initialData;

  const handleAddTransaction = async (values: any) => {
    try {
      await createTransaction(values);
      toast({ title: i.transactionAddedToastTitle.key, description: i.transactionAddedToastDescription.key });
      setOpen(false);
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.addTransactionFailed.key, variant: 'destructive' });
    }
  };

  const handleUpdateTransaction = async (values: any) => {
    if (!editingTransaction) return;
    try {
      await updateTransaction(editingTransaction.id, values);
      toast({ title: i.transactionUpdatedToastTitle.key, description: i.transactionUpdatedToastDescription.key });
      setEditingTransaction(null);
      setOpen(false);
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.updateTransactionFailed.key, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({ title: i.transactionDeletedToastTitle.key, description: i.transactionDeletedToastDescription.key });
    } catch (error) {
      toast({ title: i.errorToastTitle.key, description: i.deleteTransactionFailed.key, variant: 'destructive' });
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn: any) => {
      const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || txn.categories?.name === categoryFilter;
      const txnDate = new Date(txn.date);
      const matchesDateRange = (!dateRange.from || txnDate >= dateRange.from) && (!dateRange.to || txnDate <= dateRange.to);
      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [searchTerm, categoryFilter, dateRange, transactions]);

  const categories = useMemo(() => {
    const unique = new Set(transactions.map((t: any) => t.categories?.name).filter(Boolean));
    return ['all', ...Array.from(unique)] as string[];
  }, [transactions]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{i.title}</CardTitle>
              <CardDescription>{i.description}</CardDescription>
            </div>
            <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {i.addTransactionButton}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input placeholder={i.searchPlaceholder.key} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <MobileDataList
            items={filteredTransactions}
            type="transactions"
            renderCard={(transaction: any) => (
              <Card key={transaction.id} className="p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.categories?.name} • {format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("font-bold", transaction.type === 'income' ? "text-green-600" : "text-red-600")}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString(undefined, { style: 'currency', currency: userCurrency })}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingTransaction(transaction); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{i.deleteDialogTitle}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{i.cancelButton}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(transaction.id)}>{i.deleteButton}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            )}
          />
        </CardContent>
      </Card>

      <TransactionForm
        open={open}
        setOpen={setOpen}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
        editingTransaction={editingTransaction}
        onClose={() => { setOpen(false); setEditingTransaction(null); }}
      />
    </>
  );
}
