import Link from 'next/link'
import { HeroHeader } from '@/components/public/HeroHeader'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroHeader title="Página não encontrada" />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
