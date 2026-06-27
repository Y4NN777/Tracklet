'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createBudget(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: budget, error } = await supabase
    .from('budgets')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/(app)/growth', 'page');
  return budget;
}

export async function updateBudget(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: budget, error } = await supabase
    .from('budgets')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/(app)/growth', 'page');
  return budget;
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/(app)/growth', 'page');
}

export async function createGoal(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: goal, error } = await supabase
    .from('goals')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/(app)/growth', 'page');
  return goal;
}
