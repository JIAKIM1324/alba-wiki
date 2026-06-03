'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function WriteButton({ slug }: { slug: string }) {
  const router = useRouter()

  async function handleClick() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    router.push(`/write?community=${slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="mt-5 block w-full rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
    >
      후기 작성하기
    </button>
  )
}