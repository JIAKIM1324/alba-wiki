import { Suspense } from 'react'
import WriteForm from './WriteForm'
import Link from 'next/link'

export default function WritePage() {
  return (
    <Suspense fallback={<main className="p-6">로딩 중...</main>}>
      <main className="min-h-screen bg-gray-50 px-5 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-800">
            <h2 className="font-bold">📢 알바위키 이용 안내</h2>

            <p className="mt-2">
              알바위키는 실제 알바 경험을 공유하는 공간입니다.
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>실제 경험을 바탕으로 작성해주세요.</li>
              <li>개인정보(실명, 연락처 등)는 작성하지 마세요.</li>
              <li>욕설, 비방, 허위 사실이 포함된 게시물은 삭제될 수 있습니다.</li>
              <li>특정 개인을 식별할 수 있는 내용은 작성하지 마세요.</li>
              <li>문제 있는 게시물은 신고 기능을 통해 제보할 수 있습니다.</li>
            </ul>
          </div>

          <WriteForm />
        </div>
      </main>
    </Suspense>
  )
}