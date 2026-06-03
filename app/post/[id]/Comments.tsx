'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Comment = {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
}

type Props = {
  postId: string
  postAuthorId: string | null
}

export default function Comments({ postId, postAuthorId }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')

  useEffect(() => {
    loadComments()
  }, [])

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  const anonymousNames = useMemo(() => {
    const map = new Map<string, string>()
    let count = 1

    if (postAuthorId) {
      map.set(postAuthorId, '익명1')
      count = 2
    }

    comments.forEach((comment) => {
      if (!map.has(comment.author_id)) {
        map.set(comment.author_id, `익명${count}`)
        count += 1
      }
    })

    return map
  }, [comments, postAuthorId])

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      alert('댓글을 작성하려면 로그인이 필요합니다.')
      router.push('/login')
      return
    }

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: session.user.id,
      content,
    })

    if (error) {
      alert(error.message)
      return
    }

    setContent('')
    loadComments()
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">댓글 {comments.length}개</h2>

      <form onSubmit={submitComment} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="댓글을 입력하세요"
          className="w-full rounded-xl border px-4 py-3"
        />

        <button className="mt-3 w-full rounded-xl bg-black py-3 font-semibold text-white">
          댓글 등록
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-t pt-4">
            <div className="font-semibold">
              {anonymousNames.get(comment.author_id) || '익명'}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}