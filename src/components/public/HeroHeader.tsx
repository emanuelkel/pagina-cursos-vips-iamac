import Image from 'next/image'
import Link from 'next/link'

interface HeroHeaderProps {
  title?: string
  subtitle?: string
  showLogo?: boolean
}

export function HeroHeader({ title, subtitle, showLogo = true }: HeroHeaderProps) {
  return (
    <div className="bg-black text-white">
      {/* Barra de navegação */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="IAMAC"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Cursos VIP
          </span>
        </div>
      </div>

      {/* Hero content */}
      {(title || subtitle || showLogo) && (
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-white/60 text-base max-w-xl mx-auto">{subtitle}</p>
          )}
          {/* Linha decorativa laranja */}
          <div className="mt-6 flex justify-center">
            <div className="h-0.5 w-16 bg-orange-500 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
