'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Post = {
  id: string
  title: string
  branch_name: string | null
  rating: number | null
  created_at: string
}

export default function MyPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    loadMyPosts()
  }, [])

  async function loadMyPosts() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, branch_name, rating, created_at')
      .eq('author_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setPosts(data || [])
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
            href="/"
            className="text-sm text-gray-700"
        >
            ← 홈으로 돌아가기
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
            내가 쓴 후기
        </h1>

        <div className="mt-5 space-y-3">
          {posts.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-gray-600 shadow">
              아직 작성한 후기가 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}?from=mypage`}
                className="block rounded-2xl bg-white p-5 shadow"
              >
                <div className="font-bold text-gray-900">{post.title}</div>

                <div className="mt-2 text-sm text-gray-600">
                  {post.branch_name || '지점명 없음'}
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  평점 {post.rating || '-'}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}