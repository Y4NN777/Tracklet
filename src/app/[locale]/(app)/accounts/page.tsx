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
import { PlusCircle, Wallet, PiggyBank, CreditCard, TrendingUp, Edit, Trash2, Settings, RotateCcw } from 'lucide-react';
import { AccountForm } from '@/components/account-form';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api-client';
import { calculateAccountBalance } from '@/lib/financial-calculations';
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
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  created_at: string;
  calculatedBalance?: number;
  // Manual balance override fields
  manualOverrideActive?: boolean;
  manualBalance?: number;
  transactionImpact?: number;
  lastManualSet?: string;
}

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

const accountTypeColors = {
  checking: 'text-blue-500',
  savings: 'text-green-600',
  credit: 'text-red-600',
  investment: 'text-purple-600',
};

export default function AccountsPage() {
  const i = useIntlayer('accounts-page');
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState('USD');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();

    // Set up real-time subscriptions for balance updates
    const setupRealtimeUpdates = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Subscribe to transaction changes
      const transactionSubscription = supabase
        .channel('transactions')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${session.user.id}`
        }, () => {
          // Refresh balances when transactions change
          refreshAccountBalances();
        })
        .subscribe();

      // Subscribe to account changes
      const accountSubscription = supabase
        .channel('accounts')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'accounts',
          filter: `user_id=eq.${session.user.id}`
        }, () => {
          // Refresh accounts when accounts change
          fetchAccounts();
        })
        .subscribe();

      return () => {
        transactionSubscription.unsubscribe();
        accountSubscription.unsubscribe();
      };
    };

    const cleanup = setupRealtimeUpdates();

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const fetchAccounts = async () => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
//        console.error('No session found');
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

      // Get accounts and calculate balances
      if (accountsResponse.data) {
        const accountsData = accountsResponse.data.accounts || [];

        // Calculate balances for each account
        const accountsWithBalances = await Promise.all(
          accountsData.map(async (account: Account) => {
            try {
              const balanceData = await calculateAccountBalance(account.id, session.user.id);
              return {
                ...account,
                calculatedBalance: balanceData.balance,
                manualOverrideActive: balanceData.manualOverrideActive,
                manualBalance: balanceData.manualBalance,
                transactionImpact: balanceData.transactionImpact,
                lastManualSet: balanceData.lastManualSet
              };
            } catch (error) {
//              console.error(`Error calculating balance for account ${account.id}:`, error);
              // For accounts with manual override, don't use stored balance as fallback since it will be null
              const hasManualOverride = (account as any).manual_override_active;
              return {
                ...account,
                calculatedBalance: hasManualOverride ? 0 : (account.balance || 0) // Fallback to stored balance only for non-manual accounts
              };
            }
          })
        );

        setAccounts(accountsWithBalances);
      } else if (accountsResponse.error) {
//        console.error('Error fetching accounts:', accountsResponse.error);
      }
    } catch (error) {
//      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh account balances
  const refreshAccountBalances = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const updatedAccounts = await Promise.all(
        accounts.map(async (account: Account) => {
          try {
            const balanceData = await calculateAccountBalance(account.id, session.user.id);
            return {
              ...account,
              calculatedBalance: balanceData.balance,
              manualOverrideActive: balanceData.manualOverrideActive,
              manualBalance: balanceData.manualBalance,
              transactionImpact: balanceData.transactionImpact,
              lastManualSet: balanceData.lastManualSet
            };
          } catch (error) {
//            console.error(`Error recalculating balance for account ${account.id}:`, error);
            // For accounts with manual override, don't use stored balance as fallback since it will be null
            const hasManualOverride = (account as any).manualOverrideActive;
            return {
              ...account,
              calculatedBalance: hasManualOverride ? 0 : (account.calculatedBalance ?? account.balance ?? 0)
            };
          }
        })
      );

      setAccounts(updatedAccounts);
    } catch (error) {
//      console.error('Error refreshing account balances:', error);
    }
  };

  const handleAddAccount = async (values: any) => {
    try {
      const response = await api.createAccount(values);

      if (response.data) {
        setAccounts(prev => [response.data.account, ...prev]);
        toast({
          title: i.accountAddedToastTitle.key,
          description: i.accountAddedToastDescription.key,
        });
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
//      console.error('Error creating account:', error);
      toast({
        title: i.errorToastTitle.key,
        description: i.addAccountFailed.key,
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
      // Transform form values to match API expectations
      const apiValues = { ...values };

      // Handle manual balance override logic
      if (values.use_manual_override) {
        // User wants to set manual override
        if (values.manual_balance !== undefined) {
          apiValues.manual_balance = values.manual_balance;
          apiValues.manual_balance_note = values.manual_balance_note || null;
        }
        // Remove form-specific fields
        delete apiValues.use_manual_override;
        delete apiValues.manual_balance_note;
      } else {
        // User wants to clear manual override
        apiValues.clear_manual_override = true;
        // Remove form-specific fields
        delete apiValues.use_manual_override;
        delete apiValues.manual_balance;
        delete apiValues.manual_balance_note;
      }

      const response = await api.updateAccount(editingAccount.id, apiValues);

      if (response.data) {
        // Update the account in the local state
        setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? {
          ...response.data.account,
          // Immediately recalculate balance for UI update
          calculatedBalance: response.data.account.manual_override_active ?
            (response.data.account.manual_balance || 0) : (response.data.account.balance || 0),
          manualOverrideActive: response.data.account.manual_override_active,
          manualBalance: response.data.account.manual_balance,
          transactionImpact: 0, // Reset transaction impact for immediate UI update
          lastManualSet: response.data.account.manual_balance_set_at
        } : acc));

        setEditingAccount(null);
        toast({
          title: i.accountUpdatedToastTitle.key,
          description: i.accountUpdatedToastDescription.key,
        });
      } else if (response.error) {
//        console.error('Failed to update account:', response.error);
        toast({
          title: i.errorToastTitle.key,
          description: i.updateAccountFailed.key,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error updating account:', error);
      toast({
        title: i.errorToastTitle.key,
        description: i.updateAccountFailed.key,
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
          title: i.accountDeletedToastTitle.key,
          description: i.accountDeletedToastDescription.key,
        });
      } else if (response.error) {
//        console.error('Failed to delete account:', response.error);
        toast({
          title: i.errorToastTitle.key,
          description: i.deleteAccountFailed.key,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error deleting account:', error);
      toast({
        title: i.errorToastTitle,
        description: i.deleteAccountFailed,
        variant: 'destructive',
      });
    }
  };

  const handleClearManualOverride = async (accountId: string) => {
    try {
      const response = await api.updateAccount(accountId, { clear_manual_override: true });

      if (response.data) {
        // Update the account in the local state with cleared manual override
        setAccounts(prev => prev.map(acc => acc.id === accountId ? {
          ...response.data.account,
          // Clear manual override fields and use regular balance
          calculatedBalance: response.data.account.balance || 0,
          manualOverrideActive: false,
          manualBalance: undefined,
          transactionImpact: 0,
          lastManualSet: undefined
        } : acc));

        toast({
          title: i.accountUpdatedToastTitle.key,
          description: i.manualOverrideCleared.key,
        });
      } else if (response.error) {
//        console.error('Failed to clear manual override:', response.error);
        toast({
          title: i.errorToastTitle.key,
          description: i.clearManualOverrideFailed.key,
          variant: 'destructive',
        });
      }
    } catch (error) {
//      console.error('Error clearing manual override:', error);
      toast({
        title: i.errorToastTitle,
        description: i.clearManualOverrideFailed,
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
  };

  // Calculate net worth using calculated balances
  const netWorth = accounts.reduce((sum, account) => sum + ((account.calculatedBalance ?? account.balance) ?? 0), 0);

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
            <CardTitle>{i.title.key}</CardTitle>
            <CardDescription>{i.loadingDescription.key}</CardDescription>
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
                <CardTitle>{i.title.key}</CardTitle>
                <CardDescription>{i.description.key}</CardDescription>
              </div>
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {i.addAccountButton}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">{i.emptyTitle.key}</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {i.emptyDescription.key}
              </p>
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {i.addFirstAccountButton.key}
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
              {i.netWorthTitle.key}
            </CardTitle>
            <CardDescription>{i.netWorthDescription.key}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {netWorth.toLocaleString(i.locale || 'en-US', {
                style: 'currency',
                currency: userCurrency
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accounts by Type */}
        {Object.entries(accountsByType).map(([type, typeAccounts]) => {
          const IconComponent = accountTypeIcons[type as keyof typeof accountTypeIcons];
          const typeTotal = typeAccounts.reduce((sum, acc) => sum + ((acc.calculatedBalance ?? acc.balance) ?? 0), 0);

          return (
            <div key={type} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-5 w-5 ${accountTypeColors[type as keyof typeof accountTypeColors]}`} />
                  <h2 className="text-xl font-semibold capitalize">{typeof i.accountsTitle === 'function' ? i.accountsTitle({ type }) : `${type} Accounts`}</h2>
                  <span className="text-sm text-muted-foreground">
                    {typeof i.accountCount === 'function' ? i.accountCount({ count: typeAccounts.length }) : `(${typeAccounts.length} account${typeAccounts.length !== 1 ? 's' : ''})`}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {typeTotal.toLocaleString(i.locale || 'en-US', {
                      style: 'currency',
                      currency: userCurrency
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">{typeof i.total === 'function' ? i.total({ type }).key : `Total ${type}`}</div>
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
                          {account.manualOverrideActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearManualOverride(account.id)}
                              title={i.clearManualOverrideTooltip.key}
                            >
                              <RotateCcw className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
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
                                <AlertDialogTitle>{i.deleteDialogTitle.key}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {typeof i.deleteDialogDescription === 'function' ? i.deleteDialogDescription({ name: account.name }).key : `Are you sure you want to delete "${account.name}"? This action cannot be undone and will affect all associated transactions.`}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{i.cancelButton.key}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {i.deleteButton.key}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <div className="text-right ml-4">
                            <div className={`text-lg font-semibold ${((account.calculatedBalance ?? account.balance) ?? 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {((account.calculatedBalance ?? account.balance) ?? 0).toLocaleString(i.locale || 'en-US', {
                                style: 'currency',
                                currency: account.currency
                              })}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              {account.manualOverrideActive && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  <Settings className="h-3 w-3 mr-1" />
                                  {i.manualBadge.key}
                                </Badge>
                              )}
                              <span>{account.currency}</span>
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
            {i.addAccountButton.key}
          </Button>
        </div>
      </div>

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