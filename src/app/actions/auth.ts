'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string, // example: add name field to form
  };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError || !signUpData.user) {
    redirect('/error');
  }

  const user = signUpData.user;

  console.log('User signed up:', user);

  // Insert into `profiles` table
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      user_id: user.id, // must match Supabase auth UID
      email: user.email,
    },
  ]);

  if (profileError) {
    console.error('Error inserting profile:', profileError);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}


export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}