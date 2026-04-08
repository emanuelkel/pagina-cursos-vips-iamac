import { CourseCard } from './CourseCard'
import type { Curso } from '@/types/directus'

interface CourseListProps {
  cursos: Curso[]
  expandedId: number | null
  onToggle: (id: number) => void
}

export function CourseList({ cursos, expandedId, onToggle }: CourseListProps) {
  return (
    <div className="flex flex-col gap-3">
      {cursos.map((curso, i) => (
        <CourseCard
          key={curso.id}
          curso={curso}
          colorIndex={i}
          isExpanded={expandedId === curso.id}
          onToggle={() => onToggle(curso.id)}
        />
      ))}
    </div>
  )
}
