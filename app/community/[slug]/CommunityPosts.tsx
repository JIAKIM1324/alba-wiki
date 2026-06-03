'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CommunityPosts({ posts }: { posts: any[] }) {
  const [keyword, setKeyword] = useState('')

  const filteredPosts =
    keyword.trim() === ''
      ? posts
      : posts.filter((post) => {
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

  return (
    <>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="이 브랜드 안에서 검색: 사장님, 물류, 텃세..."
        className="mt-4 w-full rounded-xl border px-4 py-3"
      />

      <div className="mt-4 space-y-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block rounded-2xl bg-white p-4 shadow hover:bg-gray-100"
            >
              <div className="font-semibold">{post.title}</div>

              <div className="mt-2 text-sm text-gray-700">
                {post.branch_name || '지점명 없음'} · 평점 {post.rating} ·{' '}
                {post.shift_type} · {post.work_period}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {post.content}
              </p>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-5 text-gray-700 shadow">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </>
  )
}