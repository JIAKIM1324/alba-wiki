import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Comments from './Comments'
import PostActions from './PostActions'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params

  const { data: post } = await supabase
    .from('posts')
    .select('*, communities(*)')
    .eq('id', id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/community/${post.communities.slug}`}
          className="text-sm text-gray-700"
        >
          ← {post.communities.name}으로 돌아가기
        </Link>

        <article className="mt-5 rounded-2xl bg-white p-5 shadow">
          <h1 className="text-2xl font-bold">{post.title}</h1>

          {post.updated_at &&
            post.updated_at !== post.created_at && (
              <p className="mt-1 text-xs text-gray-400">
                수정됨
              </p>
          )}

          <p className="mt-2 text-gray-700">
            {post.branch_name}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-gray-100 px-3 py-2">
              평점 {post.rating}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-2">
              {post.shift_type}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-2">
              {post.work_period}
            </span>
          </div>

          <section className="mt-6">
            <h2 className="font-bold">장점</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {post.pros || '작성된 장점이 없습니다.'}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="font-bold">단점</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {post.cons || '작성된 단점이 없습니다.'}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="font-bold">후기</h2>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
              {post.content}
            </p>
          </section>
          <PostActions postId={post.id} authorId={post.author_id} />
        </article>
        <Comments postId={post.id} postAuthorId={post.author_id} />
      </div>
    </main>
  )
}