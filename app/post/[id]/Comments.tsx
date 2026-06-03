'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Comment = {
  id: string
  post_id: string
  author_id: string
  content: string
  is_deleted: boolean
  created_at: string
  updated_at: string | null
}

type Props = {
  postId: string
  postAuthorId: string | null
}


export default function Comments({ postId, postAuthorId }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    loadComments()
    loadUser()
  }, [])

  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setCurrentUserId(session?.user.id || null)
  }

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

  function startEdit(comment: Comment) {
    setEditingId(comment.id)
    setEditingContent(comment.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingContent('')
  }

  async function updateComment(commentId: string) {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    const { error } = await supabase
      .from('comments')
      .update({
        content: editingContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)

    if (error) {
      alert(error.message)
      return
    }

    setEditingId(null)
    setEditingContent('')
    loadComments()
  }

  async function reportComment(commentId: string) {
    const reason = prompt('댓글 신고 사유를 입력해주세요.')
  
    if (!reason?.trim()) return
  
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (!session) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }
  
    const { error } = await supabase.from('reports').insert({
      comment_id: commentId,
      reporter_id: session.user.id,
      reason,
    })
  
    if (error) {
      alert(error.message)
      return
    }
  
    alert('신고가 접수되었습니다.')
  }

  async function deleteComment(commentId: string) {
    const ok = confirm('댓글을 삭제할까요?')

    if (!ok) return

    const { error } = await supabase
      .from('comments')
      .update({
        content: '삭제한 댓글입니다.',
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)

    if (error) {
      alert(error.message)
      return
    }

    loadComments()
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-bold text-gray-900">
        댓글 {comments.length}개
      </h2>

      <form onSubmit={submitComment} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="댓글을 입력하세요"
          className="w-full rounded-xl border px-4 py-3 text-gray-900"
        />

        <button className="mt-3 w-full rounded-xl bg-black py-3 font-semibold text-white">
          댓글 등록
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.map((comment) => {
          const isMine = currentUserId === comment.author_id
          const isEditing = editingId === comment.id

          return (
            <div key={comment.id} className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">
                  {anonymousNames.get(comment.author_id) || '익명'}
                </div>

                <div className="flex gap-2 text-sm">
                  {isMine && !comment.is_deleted && !isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(comment)}
                        className="text-gray-700 underline"
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-600 underline"
                      >
                        삭제
                      </button>
                    </>
                  )}

                  {!isMine && !comment.is_deleted && !isEditing && (
                    <button
                      type="button"
                      onClick={() => reportComment(comment.id)}
                      className="text-gray-500 underline hover:text-red-500"
                    >
                      신고
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-gray-900"
                  />

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateComment(comment.id)}
                      className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p
                    className={`whitespace-pre-wrap ${
                      comment.is_deleted
                        ? 'text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {comment.content}
                  </p>

                  {!comment.is_deleted &&
                    comment.updated_at &&
                    comment.updated_at !== comment.created_at && (
                      <span className="mt-1 block text-xs italic text-gray-400">
                        수정됨
                      </span>
                    )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}