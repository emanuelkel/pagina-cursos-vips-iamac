import type { Curso } from '@/types/directus'
import { CourseCard } from './CourseCard'

interface CourseGridProps {
  cursos: Curso[]
}

export function CourseGrid({ cursos }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursos.map((curso) => (
        <CourseCard key={curso.id} curso={curso} />
      ))}
    </div>
  )
}
