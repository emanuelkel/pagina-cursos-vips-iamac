'use client'

import { useState, useEffect, useCallback } from 'react'
import { MousePointerClick, BookOpen, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/admin/StatsCard'
import { MonthFilter } from '@/components/admin/MonthFilter'
import { CidadeFilter } from '@/components/admin/CidadeFilter'
import { TopCoursesChart } from '@/components/admin/TopCoursesChart'
import { TopProfessorsChart } from '@/components/admin/TopProfessorsChart'

interface Stats {
  totalCliques: number
  uniqueCursos: number
  uniqueProfessores: number
}

interface CursoData {
  cursoId: number
  cursoTitulo: string
  professorNome: string
  count: number
}

interface ProfessorData {
  professorId: number
  professorNome: string
  cursoTop: string
  count: number
}

interface Cidade {
  id: number
  nome: string
}

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function AdminDashboardPage() {
  const [month, setMonth] = useState<string>(getCurrentMonth())
  const [cidade, setCidade] = useState<string>('all')
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [topCursos, setTopCursos] = useState<CursoData[]>([])
  const [topProfessores, setTopProfessores] = useState<ProfessorData[]>([])
  const [loading, setLoading] = useState(true)

  // Carrega cidades uma vez
  useEffect(() => {
    fetch('/api/dashboard/cidades')
      .then(r => r.json())
      .then(data => setCidades(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)

    const params = new URLSearchParams()
    if (month !== 'all') params.set('month', month)
    if (cidade !== 'all') params.set('cidade', cidade)
    const qs = params.toString() ? `?${params.toString()}` : ''

    try {
      const [statsRes, cursosRes, professoresRes] = await Promise.all([
        fetch(`/api/dashboard/stats${qs}`),
        fetch(`/api/dashboard/top-courses${qs}`),
        fetch(`/api/dashboard/top-professors${qs}`),
      ])

      const [statsData, cursosData, professoresData] = await Promise.all([
        statsRes.json(),
        cursosRes.json(),
        professoresRes.json(),
      ])

      setStats(statsData)
      setTopCursos(Array.isArray(cursosData) ? cursosData : [])
      setTopProfessores(Array.isArray(professoresData) ? professoresData : [])
    } catch {
      // silencioso
    } finally {
      setLoading(false)
    }
  }, [month, cidade])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const periodLabel = month === 'all'
    ? 'todos os tempos'
    : new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const cidadeLabel = cidade === 'all'
    ? 'todas as cidades'
    : cidades.find(c => String(c.id) === cidade)?.nome ?? ''

  const chartCursos = topCursos.map(c => ({
    courseId: String(c.cursoId),
    courseTitle: c.cursoTitulo,
    professorName: c.professorNome,
    count: c.count,
  }))

  const chartProfessores = topProfessores.map(p => ({
    professorId: String(p.professorId),
    professorName: p.professorNome,
    topCourse: p.cursoTop,
    count: p.count,
  }))

  return (
    <div className="space-y-8">
      {/* Cabeçalho com filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
          <p className="text-sm text-gray-500 capitalize">
            {cidadeLabel} · {periodLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CidadeFilter value={cidade} onChange={setCidade} cidades={cidades} />
          <MonthFilter value={month} onChange={setMonth} />
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Interesses"
          value={loading ? '—' : (stats?.totalCliques ?? 0)}
          icon={MousePointerClick}
          description="Cliques no botão WhatsApp"
          accent
        />
        <StatsCard
          title="Cursos Solicitados"
          value={loading ? '—' : (stats?.uniqueCursos ?? 0)}
          icon={BookOpen}
          description="Cursos com ao menos 1 interesse"
        />
        <StatsCard
          title="Professores Solicitados"
          value={loading ? '—' : (stats?.uniqueProfessores ?? 0)}
          icon={Users}
          description="Professores com ao menos 1 interesse"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              Cursos Mais Solicitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] animate-pulse bg-gray-100 rounded" />
            ) : (
              <TopCoursesChart data={chartCursos} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              Professores Mais Solicitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] animate-pulse bg-gray-100 rounded" />
            ) : (
              <TopProfessorsChart data={chartProfessores} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de cursos */}
      {topCursos.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              Ranking Detalhado — Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">#</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Curso</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Professor(a)</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">Interesses</th>
                  </tr>
                </thead>
                <tbody>
                  {topCursos.map((curso, i) => (
                    <tr key={curso.cursoId} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">{curso.cursoTitulo}</td>
                      <td className="py-2.5 px-3 text-gray-500">{curso.professorNome}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-orange-500">{curso.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
