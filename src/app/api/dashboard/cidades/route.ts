import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const directusUrl = process.env.DIRECTUS_URL!.replace(/\/$/, '')
  const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

  try {
    const res = await fetch(
      `${directusUrl}/items/iamac_cidades?fields=id,nome&filter[status][_eq]=published&sort=nome&limit=-1`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    )

    if (!res.ok) throw new Error('Falha ao buscar cidades')

    const { data } = await res.json()
    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error('Erro cidades:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
