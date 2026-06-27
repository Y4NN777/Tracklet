import { createClient } from '@/lib/supabase-server';
import { calculateAccountBalance } from '@/lib/financial-calculations';

export async function getAccountsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [accountsResponse, profileResponse] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('user_profiles').select('preferences').eq('id', user.id).single()
  ]);

  const accounts = accountsResponse.data || [];
  const userCurrency = profileResponse.data?.preferences?.currency || 'USD';

  const accountsWithBalances = await Promise.all(
    accounts.map(async (account: any) => {
      const balanceData = await calculateAccountBalance(account.id, user.id);
      return {
        ...account,
        calculatedBalance: balanceData.balance,
        manualOverrideActive: balanceData.manualOverrideActive,
      };
    })
  );

  return { accounts: accountsWithBalances, userCurrency };
}

export async function getTransactionsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [transactionsResponse, profileResponse] = await Promise.all([
    supabase.from('transactions').select('*, categories(*)').eq('user_id', user.id).order('date', { ascending: false }),
    supabase.from('user_profiles').select('preferences').eq('id', user.id).single()
  ]);

  return {
    transactions: transactionsResponse.data || [],
    userCurrency: profileResponse.data?.preferences?.currency || 'USD'
  };
}
