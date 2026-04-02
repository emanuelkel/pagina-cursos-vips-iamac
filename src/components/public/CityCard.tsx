import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

interface CityCardProps {
  name: string
  slug: string
  state: string
  description: string
}

export function CityCard({ name, slug, state, description }: CityCardProps) {
  return (
    <Link href={`/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-xl group-hover:shadow-orange-500/10">
        {/* Faixa laranja no topo */}
        <div className="h-1 bg-orange-500 w-0 group-hover:w-full transition-all duration-500" />

        <div className="p-8">
          <div className="flex items-start justify-between mb-5">
            <div className="bg-black rounded-xl p-3">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200 mt-1" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
          <p className="text-sm font-semibold text-orange-500 mb-3 uppercase tracking-wide">{state}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Indicador de clique */}
        <div className="px-8 pb-6">
          <span className="text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            Ver cursos <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
