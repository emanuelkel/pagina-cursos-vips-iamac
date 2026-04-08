import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const base = () => `${process.env.DIRECTUS_URL!.replace(/\/$/, '')}/items/iamac_cursos`
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN!}`,
})

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const res = await fetch(
    `${base()}?fields=id,titulo,status,ordem,data_curso,professor.id,professor.nome,categoria.id,categoria.nome,cidade.id,cidade.nome&sort=titulo&limit=-1`,
    { headers: headers() }
  )
  const { data } = await res.json()
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const res = await fetch(base(), { method: 'POST', headers: headers(), body: JSON.stringify(body) })
  const { data } = await res.json()
  return NextResponse.json(data, { status: 201 })
}
