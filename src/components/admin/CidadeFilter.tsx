'use client'

import { MapPin } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Cidade {
  id: number
  nome: string
}

interface CidadeFilterProps {
  value: string
  onChange: (value: string) => void
  cidades: Cidade[]
}

export function CidadeFilter({ value, onChange, cidades }: CidadeFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-52">
        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <SelectValue placeholder="Filtrar por cidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as cidades</SelectItem>
        {cidades.map((c) => (
          <SelectItem key={c.id} value={String(c.id)}>
            {c.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
