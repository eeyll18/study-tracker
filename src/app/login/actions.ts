"use server"


import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Giriş bilgileri hatalı. Lütfen tekrar deneyin.')
  }

  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect('/login?message=Kayıt işlemi sırasında bir hata oluştu. Lütfen başka bir e-posta deneyin.')
  }

  return redirect('/login?message=Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.')
}