import Image from 'next/image'
import { User, ChevronDown, Calendar, Clock, BarChart2, Users, Zap } from 'lucide-react'
import { WhatsAppButton } from './WhatsAppButton'
import { getAssetUrl } from '@/lib/directus'
import { cn } from '@/lib/utils'
import type { Curso } from '@/types/directus'

interface CourseCardProps {
  curso: Curso
  colorIndex?: number
  isExpanded?: boolean
  onToggle?: () => void
}

// Mesma paleta da CategoryGrid — orange/black alternados
const GRADIENTS = [
  { from: 'from-orange-500',   to: 'to-orange-700',   shadow: 'shadow-orange-500/40',  profBg: 'bg-white/20',   nameMuted: 'text-white/75'    },
  { from: 'from-zinc-900',     to: 'to-black',         shadow: 'shadow-black/50',        profBg: 'bg-orange-500/20', nameMuted: 'text-orange-300' },
  { from: 'from-amber-400',    to: 'to-orange-500',    shadow: 'shadow-amber-500/40',    profBg: 'bg-white/20',   nameMuted: 'text-white/75'    },
  { from: 'from-stone-800',    to: 'to-stone-950',     shadow: 'shadow-stone-900/60',    profBg: 'bg-orange-500/20', nameMuted: 'text-orange-300' },
  { from: 'from-orange-600',   to: 'to-orange-900',    shadow: 'shadow-orange-800/40',   profBg: 'bg-white/20',   nameMuted: 'text-white/75'    },
  { from: 'from-neutral-900',  to: 'to-black',         shadow: 'shadow-black/50',        profBg: 'bg-orange-500/20', nameMuted: 'text-orange-300' },
  { from: 'from-orange-400',   to: 'to-amber-600',     shadow: 'shadow-orange-400/40',   profBg: 'bg-black/20',   nameMuted: 'text-white/75'    },
  { from: 'from-gray-800',     to: 'to-zinc-950',      shadow: 'shadow-gray-900/50',     profBg: 'bg-orange-500/20', nameMuted: 'text-orange-300' },
]

function getVagasUrgency(vagas?: string): { label: string; urgent: boolean } | null {
  if (!vagas) return null
  const n = parseInt(vagas)
  if (!isNaN(n) && n <= 4) return { label: `Apenas ${n} vaga${n !== 1 ? 's' : ''}!`, urgent: true }
  if (!isNaN(n)) return { label: `${n} vagas`, urgent: false }
  return { label: vagas, urgent: false }
}

export function CourseCard({ curso, colorIndex = 0, isExpanded = false, onToggle }: CourseCardProps) {
  const professor    = typeof curso.professor === 'object' ? curso.professor : null
  const vagasInfo    = getVagasUrgency(curso.vagas)
  const grad         = GRADIENTS[colorIndex % GRADIENTS.length]

  const bannerUrl = curso.banner_image
    ? getAssetUrl(curso.banner_image, { width: 1200, height: 675, fit: 'cover' })
    : null

  const professorFotoUrl = professor?.foto
    ? getAssetUrl(professor.foto, { width: 1200, height: 1600, fit: 'cover' })
    : null

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">

      {/* Card collapsed — gradient impactante */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full cursor-pointer group',
          `bg-gradient-to-br ${grad.from} ${grad.to}`,
          'transition-all duration-300',
          'hover:brightness-110',
          'active:scale-[0.99]',
          isExpanded && 'rounded-b-none'
        )}
      >

        {/* Foto do professor — proporção 3:4 retrato */}
        <div className="relative aspect-[3/4] bg-black overflow-hidden">
          {professorFotoUrl ? (
            <Image
              src={professorFotoUrl}
              alt={professor?.nome ?? 'Professor'}
              fill
              quality={90}
              className="object-cover object-center"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 600px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-20 h-20 text-white/20" />
            </div>
          )}

          {/* Chevron no canto superior direito */}
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <ChevronDown className={cn(
                'w-4 h-4 text-white transition-transform duration-300',
                isExpanded && 'rotate-180'
              )} />
            </div>
          </div>
        </div>

        {/* Info abaixo da foto */}
        <div className={`bg-gradient-to-br ${grad.from} ${grad.to} px-4 py-3`}>
          {professor && (
            <p className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-0.5">
              {professor.nome}
            </p>
          )}
          <p className="font-black text-white text-base leading-tight mb-2">
            {curso.titulo}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {curso.data_curso && (
              <span className="flex items-center gap-1 text-xs text-white/60 font-medium">
                <Calendar className="w-3 h-3" />
                {curso.data_curso}
              </span>
            )}
            {vagasInfo && (
              <span className={cn(
                'flex items-center gap-1 text-xs font-bold',
                vagasInfo.urgent ? 'text-red-300' : 'text-white/60'
              )}>
                {vagasInfo.urgent ? <Zap className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {vagasInfo.label}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Painel expandido */}
      <div className={cn(
        'grid transition-all duration-400 ease-in-out',
        isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}>
        <div className="overflow-hidden">
          <div className="bg-white px-4 pb-6 pt-5 space-y-5 border border-t-0 border-gray-100 rounded-b-2xl">

            {/* Banner */}
            {bannerUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                <Image
                  src={bannerUrl}
                  alt={curso.titulo}
                  fill
                  quality={90}
                  className="object-cover"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 600px"
                />
              </div>
            )}

            {/* Pills de metadados */}
            {(curso.data_curso || curso.duracao || curso.nivel || curso.vagas) && (
              <div className="flex flex-wrap gap-2">
                {curso.data_curso && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    {curso.data_curso}
                  </span>
                )}
                {curso.duracao && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {curso.duracao}
                  </span>
                )}
                {curso.nivel && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                    <BarChart2 className="w-3.5 h-3.5 text-orange-500" />
                    {curso.nivel}
                  </span>
                )}
                {vagasInfo && (
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full',
                    vagasInfo.urgent
                      ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                      : 'bg-gray-100 text-gray-700'
                  )}>
                    {vagasInfo.urgent && <Zap className="w-3.5 h-3.5" />}
                    <Users className="w-3.5 h-3.5 text-orange-500" />
                    {vagasInfo.label}
                  </span>
                )}
              </div>
            )}

            {/* Descrição */}
            {curso.descricao && (
              <p className="text-sm text-gray-600 leading-relaxed">{curso.descricao}</p>
            )}

            {/* Professor destaque */}
            {professor && (
              <div className="flex items-center gap-4 p-4 bg-black rounded-2xl">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-orange-500/50">
                  {professorFotoUrl ? (
                    <Image
                      src={professorFotoUrl}
                      alt={professor.nome}
                      fill
                      quality={90}
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-widest leading-none mb-1">Ministrado por</p>
                  <p className="text-base font-black text-white">{professor.nome}</p>
                  {professor.especialidade && (
                    <p className="text-xs text-white/50 mt-0.5">{professor.especialidade}</p>
                  )}
                </div>
              </div>
            )}

            <WhatsAppButton courseId={String(curso.id)} />
          </div>
        </div>
      </div>
    </div>
  )
}
