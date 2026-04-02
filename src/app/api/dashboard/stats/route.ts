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
      `${directusUrl}/items/iamac_interesses?fields=curso,professor,cidade&limit=-1${filterParams}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    )

    if (!res.ok) throw new Error('Falha ao buscar dados')

    const { data: interesses } = await res.json()

    const uniqueCursos = new Set((interesses ?? []).map((i: { curso: number }) => i.curso)).size
    const uniqueProfessores = new Set((interesses ?? []).map((i: { professor: number }) => i.professor)).size

    return NextResponse.json({
      totalCliques: (interesses ?? []).length,
      uniqueCursos,
      uniqueProfessores,
    })
  } catch (error) {
    console.error('Erro stats:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
