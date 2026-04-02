import Image from 'next/image'
import { User } from 'lucide-react'
import { WhatsAppButton } from './WhatsAppButton'
import { getAssetUrl } from '@/lib/directus'
import type { Curso } from '@/types/directus'

interface CourseCardProps {
  curso: Curso
}

export function CourseCard({ curso }: CourseCardProps) {
  const professor = typeof curso.professor === 'object' ? curso.professor : null
  const categoria = typeof curso.categoria === 'object' ? curso.categoria : null

  const bannerUrl = curso.banner_image
    ? getAssetUrl(curso.banner_image, { width: 600, height: 340, fit: 'cover', format: 'webp', quality: 85 })
    : null

  const professorFotoUrl = professor?.foto
    ? getAssetUrl(professor.foto, { width: 120, height: 120, fit: 'cover', format: 'webp', quality: 85 })
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-black/8 hover:border-orange-200 transition-all duration-300">
      {/* Banner do curso */}
      <div className="relative w-full aspect-[16/9] bg-gray-100">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={curso.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <span className="text-orange-500 text-4xl">📚</span>
          </div>
        )}
        {/* Categoria badge */}
        {categoria && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {categoria.icone && <span>{categoria.icone}</span>}
              {categoria.nome}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Info do professor */}
        {professor && (
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-orange-500/30">
              {professorFotoUrl ? (
                <Image
                  src={professorFotoUrl}
                  alt={professor.nome}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-orange-500 font-bold uppercase tracking-wide leading-none mb-0.5">Professor(a)</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{professor.nome}</p>
            </div>
          </div>
        )}

        {/* Título e resumo */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1.5 leading-tight text-base">{curso.titulo}</h3>
          {curso.descricao && (
            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{curso.descricao}</p>
          )}
        </div>

        {/* Botão */}
        <WhatsAppButton courseId={String(curso.id)} />
      </div>
    </div>
  )
}
