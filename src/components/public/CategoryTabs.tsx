'use client'

import { useState } from 'react'
import type { Categoria, Curso } from '@/types/directus'
import { CourseGrid } from './CourseGrid'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  categorias: Categoria[]
  cursos: Curso[]
}

export function CategoryTabs({ categorias, cursos }: CategoryTabsProps) {
  const [activeCategoria, setActiveCategoria] = useState<string>('all')

  const filtered =
    activeCategoria === 'all'
      ? cursos
      : cursos.filter((c) => {
          const cat = typeof c.categoria === 'object' ? c.categoria : null
          return cat?.slug === activeCategoria
        })

  const categoriasComCursos = categorias.filter((cat) =>
    cursos.some((c) => {
      const cc = typeof c.categoria === 'object' ? c.categoria : null
      return cc?.slug === cat.slug
    })
  )

  return (
    <div>
      {/* Tabs de categoria */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategoria('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
            activeCategoria === 'all'
              ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'
          )}
        >
          Todos
        </button>
        {categoriasComCursos.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoria(cat.slug ?? String(cat.id))}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
              activeCategoria === (cat.slug ?? String(cat.id))
                ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'
            )}
          >
            {cat.icone && <span className="mr-1.5">{cat.icone}</span>}
            {cat.nome}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nenhum curso disponível nesta categoria.</p>
        </div>
      ) : (
        <CourseGrid cursos={filtered} />
      )}
    </div>
  )
}
