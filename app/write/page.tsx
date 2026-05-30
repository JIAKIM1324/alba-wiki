import { Suspense } from 'react'
import WriteForm from './WriteForm'

export default function WritePage() {
  return (
    <Suspense fallback={<main className="p-6">로딩 중...</main>}>
      <WriteForm />
    </Suspense>
  )
}