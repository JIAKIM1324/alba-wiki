'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AuthButton from './components/AuthButton'

type Post = {
  id: string
  title: string
  content: string
  branch_name: string | null
  pros: string | null
  cons: string | null
  rating: number | null
}

type Community = {
  id: string
  slug: string
  name: string
  description: string | null
  posts?: Post[]
}

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [keyword, setKeyword] = useState('')
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    async function loadCommunities() {
      const { data } = await supabase
        .from('communities')
        .select(`
          *,
          posts (
            id,
            title,
            content,
            branch_name,
            pros,
            cons,
            rating
          )
        `)
        .order('name', { ascending: true })

      setCommunities(data || [])

      const { data: recent } = await supabase
        .from('posts')
        .select(`
          *,
          communities (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentPosts(recent || [])
    }

    loadCommunities()
  }, [])

  const filteredCommunities =
  keyword.trim() === ''
    ? communities
    : communities.filter((community) => {
        const communityText = [
          community.name,
          community.slug,
          community.description || '',
        ].join(' ')

        const postText = community.posts
          ?.map((post) =>
            [
              post.title,
              post.content,
              post.branch_name || '',
              post.pros || '',
              post.cons || '',
            ].join(' ')
          )
          .join(' ')

        const searchText = `${communityText} ${postText}`.toLowerCase()

        return searchText.includes(keyword.trim().toLowerCase())
      })

  function getAverageRating(community: Community) {
    const posts = community.posts || []

    if (posts.length === 0) return '0.0'

    const sum = posts.reduce((acc, post) => acc + Number(post.rating || 0), 0)
    return (sum / posts.length).toFixed(1)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">알바위키</h1>
          <p className="mt-2 text-gray-600">
            알바하기 전에 보는 진짜 후기
          </p>
        </div>

        <AuthButton />
      </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">
            어떤 알바가 궁금한가요?
          </h2>
          <section className="mt-8">
            <h2 className="text-xl font-bold">최신 후기</h2>

            <div className="mt-4 space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block rounded-2xl bg-white p-4 shadow-sm hover:bg-gray-100"
                >
                  <div className="font-semibold">
                    {post.title}
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    {post.communities?.name}
                    {post.branch_name
                      ? ` · ${post.branch_name}`
                      : ''}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
            placeholder="CU, GS25, 메가커피, 올리브영..."
          />
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold">
            {keyword.trim() ? '검색 결과' : '인기 브랜드'}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <Link
                  key={community.id}
                  href={`/community/${community.slug}`}
                  className="rounded-2xl bg-white p-4 shadow-sm hover:bg-gray-100"
                >
                  <div className="font-semibold">{community.name}</div>

                  <div className="mt-2 flex gap-2 text-xs text-gray-500">
                    <span>평점 {getAverageRating(community)}</span>
                    <span>·</span>
                    <span>후기 {community.posts?.length || 0}개</span>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    후기 보러가기
                  </div>

                  {keyword.trim() && (
                    <div className="mt-3 space-y-1">
                      {community.posts
                        ?.filter((post) => {
                          const text = [
                            post.title,
                            post.content,
                            post.branch_name || '',
                            post.pros || '',
                            post.cons || '',
                          ]
                            .join(' ')
                            .toLowerCase()

                          return text.includes(keyword.trim().toLowerCase())
                        })
                        .slice(0, 2)
                        .map((post) => (
                          <div key={post.id} className="text-xs text-gray-500">
                            관련 후기: {post.title}
                          </div>
                        ))}
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-2 rounded-2xl bg-white p-5 text-gray-500 shadow-sm">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}