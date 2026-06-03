'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function WriteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const communitySlug = searchParams.get('community')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const [community, setCommunity] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [branchName, setBranchName] = useState('')
  const [rating, setRating] = useState('5')
  const [shiftType, setShiftType] = useState('오픈')
  const [workPeriod, setWorkPeriod] = useState('1개월 미만')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    async function loadCommunity() {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', communitySlug)
        .single()

      setCommunity(data)
    }

    if (communitySlug) loadCommunity()
  }, [communitySlug])

  async function submitReview(e: React.FormEvent) {
    
    e.preventDefault()
    if (isSubmitting) return

      setIsSubmitting(true)

    
  
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (!session) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }
  
    if (!community) {
      alert('브랜드 정보를 찾을 수 없습니다.')
      return
    }

  
    const { error } = await supabase.from('posts').insert({
      community_id: community.id,
      author_id: session.user.id,
      type: 'review',
      title,
      branch_name: branchName,
      rating: Number(rating),
      shift_type: shiftType,
      work_period: workPeriod,
      pros,
      cons,
      content,
    })
  
    if (error) {
      setIsSubmitting(false)
      alert(error.message)
      console.error(error)
      return
    }
  
    router.push(`/community/${community.slug}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">후기 작성</h1>

        <form
          onSubmit={submitReview}
          className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm"
        >
          <div>
            <label className="font-semibold">브랜드</label>
            <input
              value={community?.name || ''}
              disabled
              className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3"
            />
          </div>
          <div>
            <label className="font-semibold">지점명</label>
            <input
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
                placeholder="예: 강남역점, 홍대입구점"
                className="mt-2 w-full rounded-xl border px-4 py-3"
            />
            </div>

          <div>
            <label className="font-semibold">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="CU 야간 알바 후기"
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="font-semibold">별점</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">근무형태</label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option>오픈</option>
              <option>미들</option>
              <option>마감</option>
              <option>야간</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">근무기간</label>
            <select
              value={workPeriod}
              onChange={(e) => setWorkPeriod(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option>1개월 미만</option>
              <option>1~3개월</option>
              <option>3~6개월</option>
              <option>6개월 이상</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">장점</label>
            <textarea
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="font-semibold">단점</label>
            <textarea
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="font-semibold">자유후기</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '후기 등록'}
          </button>
        </form>
      </div>
    </main>
  )
}