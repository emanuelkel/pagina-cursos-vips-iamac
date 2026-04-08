'use client'

import { ArrowRight, Syringe, Heart, Sparkles, Leaf, Ear, Scissors, Zap, GraduationCap, type LucideIcon } from 'lucide-react'
import type { Categoria, Curso } from '@/types/directus'

interface CategoryGridProps {
  categorias: Categoria[]
  cursos: Curso[]
  onSelect: (slug: string) => void
}

// Paleta dentro da identidade IAMAC: preto, branco e laranja
// Alterna entre cards laranja-dominant e preto-dominant para criar ritmo visual
const GRADIENTS = [
  // Laranja vibrante
  { from: 'from-orange-500',  to: 'to-orange-700',  shadow: 'shadow-orange-500/40', iconBg: 'bg-white/20',      iconColor: 'text-white'        },
  // Preto premium com brilho quente
  { from: 'from-zinc-900',    to: 'to-black',        shadow: 'shadow-black/50',       iconBg: 'bg-orange-500',    iconColor: 'text-white'        },
  // Âmbar / laranja claro
  { from: 'from-amber-400',   to: 'to-orange-500',   shadow: 'shadow-amber-500/40',   iconBg: 'bg-white/25',      iconColor: 'text-white'        },
  // Carvão escuro com acento laranja
  { from: 'from-stone-800',   to: 'to-stone-950',    shadow: 'shadow-stone-900/60',   iconBg: 'bg-orange-500',    iconColor: 'text-white'        },
  // Laranja profundo
  { from: 'from-orange-600',  to: 'to-orange-900',   shadow: 'shadow-orange-800/40',  iconBg: 'bg-white/20',      iconColor: 'text-white'        },
  // Preto absoluto com laranja
  { from: 'from-neutral-900', to: 'to-black',        shadow: 'shadow-black/50',       iconBg: 'bg-orange-500',    iconColor: 'text-white'        },
  // Laranja suave / caramelo
  { from: 'from-orange-400',  to: 'to-amber-600',    shadow: 'shadow-orange-400/40',  iconBg: 'bg-black/20',      iconColor: 'text-white'        },
  // Grafite
  { from: 'from-gray-800',    to: 'to-zinc-950',     shadow: 'shadow-gray-900/50',    iconBg: 'bg-orange-500',    iconColor: 'text-white'        },
]

// Ícone baseado no nome da categoria
function getIcon(nome: string): LucideIcon {
  const n = nome.toLowerCase()
  if (n.includes('toxina') || n.includes('botulín') || n.includes('botox')) return Syringe
  if (n.includes('labial') || n.includes('lábio') || n.includes('lip'))     return Heart
  if (n.includes('bioestimulador') || n.includes('colágeno'))                return Leaf
  if (n.includes('otomodel') || n.includes('orelha') || n.includes('ear'))  return Ear
  if (n.includes('fio') || n.includes('thread') || n.includes('lifting'))   return Scissors
  if (n.includes('laser') || n.includes('luz') || n.includes('energy'))     return Zap
  if (n.includes('facial') || n.includes('preenchimento') || n.includes('harmoniz')) return Sparkles
  return GraduationCap
}

export function CategoryGrid({ categorias, cursos, onSelect }: CategoryGridProps) {
  const countByCat = new Map<string, number>()
  for (const c of cursos) {
    const cat = typeof c.categoria === 'object' ? c.categoria : null
    if (cat?.slug) {
      countByCat.set(cat.slug, (countByCat.get(cat.slug) ?? 0) + 1)
    }
  }

  const categoriasComCursos = categorias.filter(
    (cat) => cat.slug && (countByCat.get(cat.slug) ?? 0) > 0
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categoriasComCursos.map((cat, i) => {
        const count = countByCat.get(cat.slug!) ?? 0
        const grad  = GRADIENTS[i % GRADIENTS.length]
        const Icon  = getIcon(cat.nome)

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug!)}
            className="group cursor-pointer text-left w-full"
          >
            <div className={`
              relative overflow-hidden rounded-2xl
              bg-gradient-to-br ${grad.from} ${grad.to}
              shadow-xl ${grad.shadow}
              transition-all duration-300
              hover:scale-[1.03] hover:shadow-2xl
              active:scale-[0.98]
            `}>
              {/* Círculos decorativos de fundo */}
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

              <div className="relative p-5">
                {/* Linha topo: ícone + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${grad.iconBg} backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20`}>
                    <Icon className={`w-7 h-7 ${grad.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <span className="bg-white/15 text-white text-xs font-black px-2.5 py-1 rounded-full ring-1 ring-white/20">
                    {count} {count === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>

                {/* Nome */}
                <h3 className="text-white font-black text-lg leading-tight mb-1">
                  {cat.nome}
                </h3>

                {/* CTA */}
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-white/75 text-sm font-semibold group-hover:text-white transition-colors">
                    Ver cursos
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
