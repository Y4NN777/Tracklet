import { createClient } from '@/lib/supabase-server';

export async function getGrowthData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const [budgetsResponse, goalsResponse, categoriesResponse] = await Promise.all([
    supabase.from('budgets').select('*, categories(name)').eq('user_id', user.id),
    supabase.from('goals').select('*').eq('user_id', user.id), // assuming table name is goals
    supabase.from('categories').select('*').eq('user_id', user.id)
  ]);

  return {
    budgets: budgetsResponse.data || [],
    goals: goalsResponse.data || [],
    categories: categoriesResponse.data || [],
    user
  };
}
