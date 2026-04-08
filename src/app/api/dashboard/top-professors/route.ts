import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const cidade = searchParams.get('cidade')

  const directusUrl = process.env.DIRECTUS_URL!.replace(/\/$/, '')
  const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

  let filterParams = ''
  if (month && month !== 'all') {
    filterParams += `&filter[mes_ano][_eq]=${month}`
  }
  if (cidade && cidade !== 'all') {
    filterParams += `&filter[cidade][_eq]=${cidade}`
  }

  try {
    const res = await fetch(
      `${directusUrl}/items/iamac_interesses?fields=curso.id,curso.titulo,curso.professor.id,curso.professor.nome&limit=-1${filterParams}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    )

    if (!res.ok) throw new Error('Falha ao buscar dados')

    const { data: interesses } = await res.json()

    const countMap: Record<string, { professorId: number; professorNome: string; cursoTop: string; count: number }> = {}

    for (const item of interesses ?? []) {
      const professor = item.curso?.professor
      const key = professor?.id
      if (!key) continue
      if (!countMap[key]) {
        countMap[key] = {
          professorId: professor.id,
          professorNome: professor.nome,
          cursoTop: item.curso?.titulo ?? '',
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
    console.error('Erro top-professores:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
