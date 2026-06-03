'use client'

import { supabase } from '@/lib/supabase'

type Props = {
  postId: string
}

export default function ReportButton({ postId }: Props) {
  async function reportPost() {
    const reason = prompt('신고 사유를 입력해주세요.')

    if (!reason?.trim()) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      alert('로그인이 필요합니다.')
      return
    }

    const { error } = await supabase
      .from('reports')
      .insert({
        post_id: postId,
        reporter_id: session.user.id,
        reason,
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('신고가 접수되었습니다.')
  }

  return (
    <button
      onClick={reportPost}
      className="text-sm text-red-600 underline"
    >
      🚩 신고하기
    </button>
  )
}