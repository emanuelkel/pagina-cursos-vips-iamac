import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')

  const directusUrl = process.env.DIRECTUS_URL!.replace(/\/$/, '')
  const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

  let filterParams = ''
  if (month && month !== 'all') {
    filterParams = `&filter[mes_ano][_eq]=${month}`
  }

  try {
    const res = await fetch(
      `${directusUrl}/items/iamac_interesses?fields=curso.id,curso.titulo,professor.nome&limit=-1${filterParams}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    )

    if (!res.ok) throw new Error('Falha ao buscar dados')

    const { data: interesses } = await res.json()

    const countMap: Record<string, { cursoId: number; cursoTitulo: string; professorNome: string; count: number }> = {}

    for (const item of interesses ?? []) {
      const key = item.curso?.id
      if (!key) continue
      if (!countMap[key]) {
        countMap[key] = {
          cursoId: item.curso.id,
          cursoTitulo: item.curso.titulo,
          professorNome: item.professor?.nome ?? '',
          count: 0,
        }
      }
      countMap[key].count++
    }

    const result = Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro top-cursos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
