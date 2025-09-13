'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Wallet, PiggyBank, CreditCard, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { AccountForm } from '@/components/account-form';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api-client';
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

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  created_at: string;
}

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

const accountTypeColors = {
  checking: 'text-blue-600',
  savings: 'text-green-600',
  credit: 'text-red-600',
  investment: 'text-purple-600',
};

export default function AccountsPage() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState('USD');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('No session found');
        setLoading(false);
        return;
      }

      // Fetch user profile and accounts in parallel
      const [profileResponse, accountsResponse] = await Promise.all([
        supabase.from('user_profiles').select('preferences').eq('id', session.user.id).single(),
        api.getAccounts()
      ]);

      // Get user's preferred currency
      if (profileResponse.data?.preferences?.currency) {
        setUserCurrency(profileResponse.data.preferences.currency);
      }

      // Get accounts
      if (accountsResponse.data) {
        setAccounts(accountsResponse.data.accounts || []);
      } else if (accountsResponse.error) {
        console.error('Error fetching accounts:', accountsResponse.error);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (values: any) => {
    try {
      const response = await api.createAccount(values);

      if (response.data) {
        setAccounts(prev => [response.data.account, ...prev]);
        toast({
          title: 'Account added!',
          description: 'Your account has been created successfully.',
        });
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to add account. Please try again.',
        variant: 'destructive',
      });
      // Re-throw the error so the form can handle it
      throw error;
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setOpen(true);
  };

  const handleUpdateAccount = async (values: any) => {
    if (!editingAccount) return;

    try {
      const response = await api.updateAccount(editingAccount.id, values);

      if (response.data) {
        setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? response.data.account : acc));
        setEditingAccount(null);
        toast({
          title: 'Account updated!',
          description: 'Your account has been updated successfully.',
        });
      } else if (response.error) {
        console.error('Failed to update account:', response.error);
        toast({
          title: 'Error',
          description: 'Failed to update account. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to update account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await api.deleteAccount(accountId);

      if (response.data || (!response.error && !response.data)) {
        // DELETE returns 204 No Content, so no data but success
        setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        toast({
          title: 'Account deleted!',
          description: 'Your account has been deleted successfully.',
        });
      } else if (response.error) {
        console.error('Failed to delete account:', response.error);
        toast({
          title: 'Error',
          description: 'Failed to delete account. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
  };

  // Calculate net worth
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Group accounts by type
  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>Loading your accounts...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Accounts</CardTitle>
                <CardDescription>Manage your financial accounts and track your net worth.</CardDescription>
              </div>
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No accounts yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Start tracking your finances by adding your bank accounts, credit cards, and investment accounts.
              </p>
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Account
              </Button>
            </div>
          </CardContent>
        </Card>
        <AccountForm
          open={open}
          setOpen={setOpen}
          onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
          editingAccount={editingAccount}
          onClose={handleClose}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Net Worth Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Net Worth
            </CardTitle>
            <CardDescription>Your total financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {netWorth.toLocaleString('en-US', {
                style: 'currency',
                currency: userCurrency
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accounts by Type */}
        {Object.entries(accountsByType).map(([type, typeAccounts]) => {
          const IconComponent = accountTypeIcons[type as keyof typeof accountTypeIcons];
          const typeTotal = typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);

          return (
            <div key={type} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-5 w-5 ${accountTypeColors[type as keyof typeof accountTypeColors]}`} />
                  <h2 className="text-xl font-semibold capitalize">{type} Accounts</h2>
                  <span className="text-sm text-muted-foreground">
                    ({typeAccounts.length} account{typeAccounts.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {typeTotal.toLocaleString('en-US', {
                      style: 'currency',
                      currency: userCurrency
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">Total {type}</div>
                </div>
              </div>

              <MobileDataList
                items={typeAccounts}
                type="generic"
                renderCard={(account) => {
                  const IconComponent = accountTypeIcons[account.type as keyof typeof accountTypeIcons];
                  const colorClass = accountTypeColors[account.type as keyof typeof accountTypeColors];

                  return (
                    <Card key={account.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-8 w-8 ${colorClass}`} />
                          <div>
                            <h3 className="font-semibold">{account.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAccount(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{account.name}"? This action cannot be undone and will affect all associated transactions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <div className="text-right ml-4">
                            <div className={`text-lg font-semibold ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {account.balance.toLocaleString('en-US', {
                                style: 'currency',
                                currency: account.currency
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {account.currency}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                }}
                emptyState={{
                  title: `No ${type} accounts`,
                  description: `Add your first ${type} account to start tracking.`,
                }}
              />
            </div>
          );
        })}

        {/* Add Account Button */}
        <div className="flex justify-center">
          <Button onClick={() => setOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      <AccountForm open={open} setOpen={setOpen} onSubmit={handleAddAccount} />
    </>
  );
}