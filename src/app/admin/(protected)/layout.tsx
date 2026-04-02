import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { BarChart3, Globe } from 'lucide-react'

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
            <Image
              src="/logo.png"
              alt="IAMAC"
              width={100}
              height={30}
              className="h-8 w-auto"
            />
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-white/80">Dashboard</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-orange-500 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Ver site
          </Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}
