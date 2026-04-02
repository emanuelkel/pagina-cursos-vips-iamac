import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { HeroHeader } from '@/components/public/HeroHeader'
import { CategoryTabs } from '@/components/public/CategoryTabs'
import { getCursosByCidade, getCategorias } from '@/lib/queries'
import { CITY_DISPLAY, isCitySlug, VALID_CITY_SLUGS } from '@/constants/cities'

export const revalidate = 60

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return VALID_CITY_SLUGS.map((slug) => ({ city: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  if (!isCitySlug(city)) return {}

  const cityData = CITY_DISPLAY[city]
  return {
    title: `Cursos VIP — ${cityData.name} | IAMAC`,
    description: `Cursos VIP de harmonização facial e estética avançada em ${cityData.name} — ${cityData.state}`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params

  if (!isCitySlug(city)) notFound()

  const cityData = CITY_DISPLAY[city]
  const [cursos, categorias] = await Promise.all([
    getCursosByCidade(city),
    getCategorias(),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroHeader
        title={cityData.name}
        subtitle={`Cursos VIP disponíveis • ${cityData.state}`}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {cursos.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">Nenhum curso disponível</p>
            <p className="text-sm text-gray-400">Em breve novos cursos serão publicados para esta unidade.</p>
          </div>
        ) : (
          <CategoryTabs categorias={categorias} cursos={cursos} />
        )}
      </div>

      {/* Footer mínimo */}
      <div className="border-t border-gray-100 bg-white mt-8 py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
            ← Outras unidades
          </a>
          <span className="text-xs text-gray-300">IAMAC © {new Date().getFullYear()}</span>
        </div>
      </div>
    </main>
  )
}
