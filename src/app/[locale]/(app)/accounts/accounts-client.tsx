'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Wallet, PiggyBank, CreditCard, TrendingUp, Edit, Trash2, Settings, RotateCcw, Smartphone, DollarSign, Briefcase, MoreHorizontal } from 'lucide-react';
import { AccountForm } from '@/components/account-form';
import { createAccount, updateAccount, deleteAccount } from '@/lib/actions/accounts';
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
import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  calculatedBalance?: number;
  manualOverrideActive?: boolean;
}

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

const accountTypeColors: any = {
  bank_account: 'text-blue-500',
  savings: 'text-green-600',
  credit: 'text-red-600',
  investment: 'text-purple-600',
  mobile_money: 'text-orange-500',
  cash: 'text-yellow-600',
  business_fund: 'text-indigo-600',
  other: 'text-gray-600',
};

export function AccountsClient({ initialData }: { initialData: any }) {
  const i = useIntlayer('accounts-page');
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const { toast } = useToast();

  const { accounts, userCurrency } = initialData;

  const handleAddAccount = async (values: any) => {
    try {
      await createAccount(values);
      toast({ title: i.accountAddedToastTitle.key, description: i.accountAddedToastDescription.key });
      setOpen(false);
    } catch (error: any) {
      toast({ title: i.errorToastTitle.key, description: i.addAccountFailed.key, variant: 'destructive' });
    }
  };

  const handleUpdateAccount = async (values: any) => {
    if (!editingAccount) return;
    try {
      await updateAccount(editingAccount.id, values);
      toast({ title: i.accountUpdatedToastTitle.key, description: i.accountUpdatedToastDescription.key });
      setEditingAccount(null);
      setOpen(false);
    } catch (error: any) {
      toast({ title: i.errorToastTitle.key, description: i.updateAccountFailed.key, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id);
      toast({ title: i.accountDeletedToastTitle.key, description: i.accountDeletedToastDescription.key });
    } catch (error: any) {
      toast({ title: i.errorToastTitle.key, description: i.deleteAccountFailed.key, variant: 'destructive' });
    }
  };

  const netWorth = accounts.reduce((sum: number, acc: any) => sum + (acc.calculatedBalance || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {i.netWorthTitle.key}
          </CardTitle>
          <CardDescription>{i.netWorthDescription.key}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {netWorth.toLocaleString(undefined, { style: 'currency', currency: userCurrency })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{i.title.key}</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {i.addAccountButton.key}
        </Button>
      </div>

      <MobileDataList
        items={accounts}
        type="generic"
        renderCard={(account: any) => {
          const Icon = accountTypeIcons[account.type] || Wallet;
          return (
            <Card key={account.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-8 w-8 ${accountTypeColors[account.type]}`} />
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    <Badge variant="outline">{account.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingAccount(account); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{i.deleteDialogTitle.key}</AlertDialogTitle>
                        <AlertDialogDescription>{i.deleteDialogDescription.key}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{i.cancelButton.key}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(account.id)} className="bg-destructive">{i.deleteButton.key}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="text-right ml-4">
                    <div className="text-lg font-semibold">
                      {(account.calculatedBalance || 0).toLocaleString(undefined, { style: 'currency', currency: account.currency })}
                    </div>
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
        onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
        editingAccount={editingAccount}
        onClose={() => { setOpen(false); setEditingAccount(null); }}
      />
    </div>
  );
}
