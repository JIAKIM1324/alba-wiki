'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState('')
  const [branchName, setBranchName] = useState('')
  const [rating, setRating] = useState('')
  const [shiftType, setShiftType] = useState('')
  const [workPeriod, setWorkPeriod] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [content, setContent] = useState('')
  const [authorId, setAuthorId] = useState<string | null>(null)

  useEffect(() => {
    loadPost()
  }, [])

  async function loadPost() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !post) {
      alert('게시글을 찾을 수 없습니다.')
      router.push('/')
      return
    }

    if (post.author_id !== session.user.id) {
      alert('수정 권한이 없습니다.')
      router.push(`/post/${id}`)
      return
    }

    setTitle(post.title || '')
    setBranchName(post.branch_name || '')
    setRating(String(post.rating || ''))
    setShiftType(post.shift_type || '')
    setWorkPeriod(post.work_period || '')
    setPros(post.pros || '')
    setCons(post.cons || '')
    setContent(post.content || '')
    setAuthorId(post.author_id)
  }

  async function updatePost(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        branch_name: branchName,
        rating: Number(rating),
        shift_type: shiftType,
        work_period: workPeriod,
        pros,
        cons,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    router.push(`/post/${id}`)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <form
        onSubmit={updatePost}
        className="mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow"
      >
        <h1 className="text-2xl font-bold">후기 수정</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목"
          className="mt-5 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <input
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="지점명"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <input
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          type="number"
          min="1"
          max="5"
          placeholder="평점"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <input
          value={shiftType}
          onChange={(e) => setShiftType(e.target.value)}
          placeholder="근무 형태"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <input
          value={workPeriod}
          onChange={(e) => setWorkPeriod(e.target.value)}
          placeholder="근무 기간"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <textarea
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          placeholder="장점"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <textarea
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          placeholder="단점"
          className="mt-3 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="후기"
          className="mt-3 min-h-40 w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <button className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white">
          수정 완료
        </button>
      </form>
    </main>
  )
}