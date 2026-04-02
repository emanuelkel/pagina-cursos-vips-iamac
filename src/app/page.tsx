import Image from 'next/image'
import Link from 'next/link'
import { CityCard } from '@/components/public/CityCard'
import { CITY_DISPLAY, VALID_CITY_SLUGS } from '@/constants/cities'
import { MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero preto com logo */}
      <div className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-16 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="IAMAC"
            width={220}
            height={64}
            className="h-16 w-auto mb-10"
            priority
          />
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-orange-500" />
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Cursos VIP</span>
            <div className="h-px w-8 bg-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Escolha sua<br />
            <span className="text-orange-500">unidade</span>
          </h1>
          <p className="text-white/50 text-base max-w-sm">
            Selecione a cidade para ver os cursos VIP disponíveis
          </p>
        </div>
      </div>

      {/* Cards de cidade */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALID_CITY_SLUGS.map((slug) => {
            const city = CITY_DISPLAY[slug]
            return (
              <CityCard
                key={slug}
                slug={slug}
                name={city.name}
                state={city.state}
                description={city.description}
              />
            )
          })}
        </div>

        {/* Footer mínimo */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="text-xs text-gray-400">Juazeiro do Norte — CE &nbsp;|&nbsp; Petrolina — PE</span>
        </div>
      </div>
    </main>
  )
}
