'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user || null)
    }

    loadUser()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
      >
        로그인
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        익명 회원
      </span>

      <button
        onClick={logout}
        className="rounded-xl border px-4 py-2 text-sm"
      >
        로그아웃
      </button>
    </div>
  )
}