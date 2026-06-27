'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createTransaction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/transactions', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');

  return transaction;
}

export async function updateTransaction(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: transaction, error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/transactions', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');

  return transaction;
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/transactions', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');
}
