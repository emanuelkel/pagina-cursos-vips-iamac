import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const session = createSessionCookie()
  const response = NextResponse.json({ ok: true })

  response.cookies.set(session.name, session.value, session.options as Parameters<typeof response.cookies.set>[2])

  return response
}
