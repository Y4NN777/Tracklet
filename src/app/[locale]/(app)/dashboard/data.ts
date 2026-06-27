import { createClient } from '@/lib/supabase-server';
import { calculateFinancialSummary, calculateAccountBalance, calculateBudgetProgress } from '@/lib/financial-calculations';

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;

  // Fetch data in parallel
  const [summary, accountsResponse, transactionsResponse, budgetsResponse] = await Promise.all([
    calculateFinancialSummary(userId, 1),
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('transactions').select('*, categories(name)').eq('user_id', userId).order('date', { ascending: false }).limit(5),
    supabase.from('budgets').select('id').eq('user_id', userId)
  ]);

  // Calculate balances for accounts
  let netWorth = 0;
  let totalSavings = 0;
  const accountsWithBalances = await Promise.all(
    (accountsResponse.data || []).map(async (account) => {
      const balanceData = await calculateAccountBalance(account.id, userId);
      netWorth += balanceData.balance;
      if (account.is_savings) totalSavings += balanceData.balance;
      return { ...account, balance: balanceData.balance };
    })
  );

  // Calculate budget progress
  const budgetsWithProgress = await Promise.all(
    (budgetsResponse.data || []).map(async (b) => calculateBudgetProgress(b.id, userId))
  );

  return {
    user,
    summary,
    accounts: accountsWithBalances,
    recentTransactions: transactionsResponse.data || [],
    budgets: budgetsWithProgress.filter(Boolean),
    netWorth,
    totalSavings,
  };
}
