import { CourseGridSkeleton } from '@/components/public/CourseCardSkeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-black h-36 animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="flex gap-2 mb-8 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <CourseGridSkeleton />
      </div>
    </main>
  )
}
