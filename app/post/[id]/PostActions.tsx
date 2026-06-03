'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Props = {
  postId: string
  authorId: string
}

export default function PostActions({ postId, authorId }: Props) {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setCurrentUserId(session?.user.id || null)
  }

  async function deletePost() {
    const ok = confirm('게시글을 삭제할까요?')

    if (!ok) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  if (currentUserId !== authorId) {
    return null
  }

  return (
    <div className="mt-4 flex justify-end gap-3 text-sm">
      <Link
        href={`/post/${postId}/edit`}
        className="text-gray-700 underline"
      >
        수정
      </Link>

      <button
        type="button"
        onClick={deletePost}
        className="text-red-600 underline"
      >
        삭제
      </button>
    </div>
  )
}