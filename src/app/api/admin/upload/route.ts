import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const directusUrl = process.env.DIRECTUS_URL!.replace(/\/$/, '')
  const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

  try {
    const formData = await request.formData()
    const res = await fetch(`${directusUrl}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const { data } = await res.json()
    return NextResponse.json({ id: data.id })
  } catch (error) {
    console.error('Erro upload:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
