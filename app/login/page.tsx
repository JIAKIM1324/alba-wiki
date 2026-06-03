'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">로그인</h1>

        <p className="mt-2 text-gray-600">
          후기를 작성하려면 로그인이 필요합니다.
        </p>

        <button
          onClick={loginWithGoogle}
          className="mt-8 w-full rounded-xl bg-black py-3 font-semibold text-white"
        >
          Google로 로그인
        </button>
      </div>
    </main>
  )
}