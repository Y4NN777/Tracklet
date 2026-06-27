import { createClient } from '@/lib/supabase-server';

export async function getTransactionsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const [transactionsResponse, profileResponse, accountsResponse, categoriesResponse] = await Promise.all([
    supabase.from('transactions').select('*, categories(*), accounts(*), budgets(*)').eq('user_id', user.id).order('date', { ascending: false }),
    supabase.from('user_profiles').select('preferences').eq('id', user.id).single(),
    supabase.from('accounts').select('*').eq('user_id', user.id),
    supabase.from('categories').select('*').eq('user_id', user.id)
  ]);

  return {
    transactions: transactionsResponse.data || [],
    userCurrency: profileResponse.data?.preferences?.currency || 'USD',
    accounts: accountsResponse.data || [],
    categories: categoriesResponse.data || [],
    user
  };
}
