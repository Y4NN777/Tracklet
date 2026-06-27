'use client';

import { useState, useMemo } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { Input } from '@/components/ui/input';
import { Receipt, Edit, Trash2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/actions/transactions';
import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';
import { Card } from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function TransactionsClient({ initialData }: { initialData: any }) {
  const i = useIntlayer('main-nav');
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { transactions, userCurrency } = initialData;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn: any) =>
      txn.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, transactions]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({ title: "Success", description: "Transaction deleted successfully" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, values);
        toast({ title: "Success", description: "Transaction updated successfully" });
      } else {
        await createTransaction(values);
        toast({ title: "Success", description: "Transaction added successfully" });
      }
      setOpen(false);
      setEditingTransaction(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full pl-10 h-11"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
             <Receipt className="h-4 w-4" />
          </div>
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="rounded-full ml-4 h-11 px-6">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <MobileDataList
        items={filteredTransactions}
        type="transactions"
        renderCard={(transaction: any) => (
          <Card key={transaction.id} className="p-4 border-none shadow-sm bg-card hover:bg-muted/50 transition-colors mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  transaction.type === 'income' ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                )}>
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold truncate max-w-[150px]">{transaction.description}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase">{transaction.categories?.name} • {format(new Date(transaction.date), 'MMM dd')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("font-bold", transaction.type === 'income' ? "text-green-600" : "")}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString(undefined, { style: 'currency', currency: userCurrency })}
                </div>
                <div className="flex">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingTransaction(transaction); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete Transaction</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(transaction.id)} className="bg-destructive">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        )}
      />

      <TransactionForm
        open={open}
        setOpen={setOpen}
        onSubmit={handleFormSubmit}
        editingTransaction={editingTransaction}
        onClose={() => { setOpen(false); setEditingTransaction(null); }}
      />
    </div>
  );
}
