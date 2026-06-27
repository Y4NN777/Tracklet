'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createAccount(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: account, error } = await supabase
    .from('accounts')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/wallet', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');

  return account;
}

export async function updateAccount(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: account, error } = await supabase
    .from('accounts')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/wallet', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');

  return account;
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/(app)/wallet', 'page');
  revalidatePath('/[locale]/(app)/dashboard', 'page');
}
