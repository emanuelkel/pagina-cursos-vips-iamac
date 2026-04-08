'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Categoria, Curso } from '@/types/directus'
import { CategoryGrid } from './CategoryGrid'
import { CourseList } from './CourseList'

interface CategoryTabsProps {
  categorias: Categoria[]
  cursos: Curso[]
}

export function CategoryTabs({ categorias, cursos }: CategoryTabsProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [expandedCursoId, setExpandedCursoId] = useState<number | null>(null)

  function handleSelectCategoria(slug: string) {
    setSelectedCategoria(slug)
    setExpandedCursoId(null)
  }

  function handleBack() {
    setSelectedCategoria(null)
    setExpandedCursoId(null)
  }

  function handleToggleCurso(id: number) {
    setExpandedCursoId((prev) => (prev === id ? null : id))
  }

  // Stage 1: Grade de categorias
  if (!selectedCategoria) {
    return (
      <CategoryGrid
        categorias={categorias}
        cursos={cursos}
        onSelect={handleSelectCategoria}
      />
    )
  }

  // Stage 2: Lista de cursos da categoria selecionada
  const categoriaAtiva = categorias.find((c) => c.slug === selectedCategoria)
  const cursosFiltrados = cursos.filter((c) => {
    const cat = typeof c.categoria === 'object' ? c.categoria : null
    return cat?.slug === selectedCategoria
  })

  return (
    <div>
      {/* Cabeçalho com voltar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Categorias
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          {categoriaAtiva?.icone && (
            <span className="text-xl">{categoriaAtiva.icone}</span>
          )}
          <span className="font-bold text-gray-900">{categoriaAtiva?.nome}</span>
          <span className="text-xs text-gray-400 font-medium">
            {cursosFiltrados.length} curso{cursosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {cursosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nenhum curso disponível nesta categoria.</p>
        </div>
      ) : (
        <CourseList
          cursos={cursosFiltrados}
          expandedId={expandedCursoId}
          onToggle={handleToggleCurso}
        />
      )}
    </div>
  )
}
