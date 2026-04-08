import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { BarChart3, Globe, BookOpen, Tag, Users } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/professores', label: 'Professores', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await getAdminSession()

  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="IAMAC" width={100} height={30} className="h-8 w-auto" />
            <div className="h-5 w-px bg-white/20" />
            <span className="text-sm font-semibold text-white/60">Admin</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-orange-500 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Ver site
          </Link>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 pb-0">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors border-b-2 border-transparent hover:border-orange-500/50"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}
