import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!community) {
    notFound()
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('community_id', community.id)
    .order('created_at', { ascending: false })

  const averageRating =
    posts && posts.length > 0
      ? (
          posts.reduce((sum, post) => sum + Number(post.rating || 0), 0) /
          posts.length
        ).toFixed(1)
      : '0.0'

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-500">
          ← 홈으로
        </Link>

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-bold">{community.name}</h1>

          <div className="mt-4 flex gap-3 text-sm">
            <div className="rounded-full bg-gray-100 px-3 py-2">
              평점 {averageRating}
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-2">
              후기 {posts?.length || 0}개
            </div>
          </div>

          <Link
            href={`/write?community=${community.slug}`}
            className="mt-5 block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            후기 작성하기
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">후기 목록</h2>

          <div className="mt-4 space-y-3">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="font-semibold">{post.title}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    평점 {post.rating} · {post.shift_type} · {post.work_period}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                    {post.content}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-5 text-gray-500 shadow-sm">
                아직 후기가 없습니다. 첫 후기를 남겨주세요.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}