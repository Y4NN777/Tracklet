'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Wallet, PiggyBank, CreditCard, TrendingUp, Edit, Trash2, Smartphone, DollarSign, Briefcase, MoreHorizontal } from 'lucide-react';
import { AccountForm } from '@/components/account-form';
import { createAccount, updateAccount, deleteAccount } from '@/lib/actions/accounts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';

const accountTypeIcons: any = {
  bank_account: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  mobile_money: Smartphone,
  cash: DollarSign,
  business_fund: Briefcase,
  other: MoreHorizontal,
};

export function AccountsClient({ initialData }: { initialData: any }) {
  const i = useIntlayer('main-nav');
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const { toast } = useToast();
  const { accounts, userCurrency } = initialData;

  const netWorth = accounts.reduce((sum: number, acc: any) => sum + (acc.calculatedBalance || 0), 0);

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id);
      toast({ title: "Success", description: "Account deleted successfully" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, values);
        toast({ title: "Success", description: "Account updated successfully" });
      } else {
        await createAccount(values);
        toast({ title: "Success", description: "Account created successfully" });
      }
      setOpen(false);
      setEditingAccount(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {netWorth.toLocaleString(undefined, { style: 'currency', currency: userCurrency })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Accounts</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Account
        </Button>
      </div>

      <MobileDataList
        items={accounts}
        type="generic"
        renderCard={(account: any) => {
          const Icon = accountTypeIcons[account.type] || Wallet;
          return (
            <Card key={account.id} className="p-4 border-none shadow-sm bg-card hover:bg-muted/50 transition-colors mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{account.name}</h3>
                    <Badge variant="secondary" className="text-[10px] uppercase">{account.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {(account.calculatedBalance || 0).toLocaleString(undefined, { style: 'currency', currency: account.currency })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingAccount(account); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete Account</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(account.id)} className="bg-destructive">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          );
        }}
      />

      <AccountForm
        open={open}
        setOpen={setOpen}
        onSubmit={handleFormSubmit}
        editingAccount={editingAccount}
        onClose={() => { setOpen(false); setEditingAccount(null); }}
      />
    </div>
  );
}
