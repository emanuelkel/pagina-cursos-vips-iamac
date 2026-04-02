import { NextRequest, NextResponse } from 'next/server'
import { buildWhatsAppUrl, buildCourseMessage } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'courseId obrigatório' }, { status: 400 })
    }

    const directusUrl = process.env.DIRECTUS_URL!.replace(/\/$/, '')
    const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

    const fields = [
      'id', 'titulo', 'mensagem_whatsapp',
      'professor.id', 'professor.nome', 'professor.whatsapp',
      'cidade.id', 'cidade.whatsapp',
      'categoria.id',
    ].join(',')

    const res = await fetch(`${directusUrl}/items/iamac_cursos/${courseId}?fields=${fields}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
    }

    const { data: curso } = await res.json()

    // Registrar interesse (sem bloquear a resposta)
    fetch(`${directusUrl}/items/iamac_interesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        curso: courseId,
        professor: curso.professor?.id,
        cidade: curso.cidade?.id,
        categoria: curso.categoria?.id,
        user_agent: request.headers.get('user-agent') ?? '',
        mes_ano: new Date().toISOString().slice(0, 7), // "2026-04"
      }),
    }).catch(() => {})

    // Resolver número de telefone (hierarquia)
    const phone =
      curso.professor?.whatsapp ||
      curso.cidade?.whatsapp ||
      ''

    if (!phone) {
      return NextResponse.json({ error: 'Número de WhatsApp não configurado' }, { status: 422 })
    }

    const message = buildCourseMessage(
      curso.titulo,
      curso.professor?.nome ?? '',
      curso.mensagem_whatsapp || undefined
    )

    const whatsappUrl = buildWhatsAppUrl(phone, message)
    return NextResponse.json({ whatsappUrl })
  } catch (error) {
    console.error('Erro no tracking WhatsApp:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
