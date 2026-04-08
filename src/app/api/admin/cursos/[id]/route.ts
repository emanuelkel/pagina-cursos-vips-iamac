import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const base = (id: string) => `${process.env.DIRECTUS_URL!.replace(/\/$/, '')}/items/iamac_cursos/${id}`
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN!}`,
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const res = await fetch(`${base(params.id)}?fields=*`, { headers: headers() })
  const { data } = await res.json()
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const res = await fetch(base(params.id), { method: 'PATCH', headers: headers(), body: JSON.stringify(body) })
  const { data } = await res.json()
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await fetch(base(params.id), { method: 'DELETE', headers: headers() })
  return new NextResponse(null, { status: 204 })
}
