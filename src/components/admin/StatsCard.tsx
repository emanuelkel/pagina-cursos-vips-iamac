import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  color?: string
  accent?: boolean
}

export function StatsCard({ title, value, icon: Icon, description, accent = false }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-white/70' : 'text-gray-500'}`}>
          {title}
        </p>
        <div className={`rounded-lg p-2 ${accent ? 'bg-white/20' : 'bg-orange-50'}`}>
          <Icon className={`w-4 h-4 ${accent ? 'text-white' : 'text-orange-500'}`} />
        </div>
      </div>
      <p className={`text-3xl font-extrabold mb-1 ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {description && (
        <p className={`text-xs ${accent ? 'text-white/60' : 'text-gray-400'}`}>{description}</p>
      )}
    </div>
  )
}
