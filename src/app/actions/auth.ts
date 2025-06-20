'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (signUpError || !signUpData.user) {
    return { error: signUpError?.message || 'Sign up failed' }
  }

  const user = signUpData.user

  const { error: profileError } = await supabase.from('profiles').insert([
    {
      user_id: user.id,
      email: user.email,
    },
  ])

  if (profileError) {
    return { error: 'Profile creation failed' }
  }

  return { success: 'Sign up successful! Please check your email to confirm.' } // ✅
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}